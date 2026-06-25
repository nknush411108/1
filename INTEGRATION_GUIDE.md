# Google 試算表整合指南

本指南詳細說明如何將前端網站與 Google 試算表整合，實現單字管理功能。

---

## 📋 目錄

1. [準備階段](#準備階段)
2. [第一步：建立 Google 試算表](#第一步建立-google-試算表)
3. [第二步：編寫 Google Apps Script](#第二步編寫-google-apps-script)
4. [第三步：部署 Apps Script 為 Web App](#第三步部署-apps-script-為-web-app)
5. [第四步：修改前端頁面](#第四步修改前端頁面)
6. [第五步：測試整合](#第五步測試整合)

---

## 準備階段

### 需要的工具
- ✅ Google 帳戶
- ✅ Google Drive
- ✅ 現有的前端項目
- ✅ 瀏覽器開發者工具

---

## 第一步：建立 Google 試算表

### 1.1 建立新試算表

1. 登入 [Google Drive](https://drive.google.com)
2. 點擊「**+ 新增**」→ 「**Google 試算表**」
3. 將試算表命名為：**「English Words Database」**（或你喜歡的名稱）

### 1.2 設定試算表結構

在試算表中建立以下欄位：

| 欄位編號 | 欄位名稱 | 類型 | 說明 |
|---------|---------|------|------|
| A | ID | 文字 | 唯一識別符（自動生成） |
| B | English | 文字 | 英文單字 |
| C | Chinese | 文字 | 中文翻譯 |
| D | Root Analysis | 文字 | 字根分析 |
| E | Example | 文字 | 例句 |
| F | Part of Speech | 文字 | 詞性（n.名詞、v.動詞等） |
| G | Created Date | 文字 | 建立日期（自動生成） |

### 1.3 建立標題行

在第一行（A1:G1）輸入以下標題：

```
ID | English | Chinese | Root Analysis | Example | Part of Speech | Created Date
```

### 1.4 保存試算表 ID

- 在瀏覽器 URL 中找到試算表 ID
- URL 格式：`https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit`
- 複製 `YOUR_SPREADSHEET_ID` 部分，稍後會用到

### 1.5 共享設定（重要）

1. 點擊右上角「**共享**」
2. 點擊「**變更**」
3. 選擇「**任何知道連結的人**」
4. 角色選擇「**編輯者**」
5. 點擊「**複製連結**」並保存
6. 點擊「**共享**」

---

## 第二步：編寫 Google Apps Script

### 2.1 開啟 Apps Script 編輯器

1. 在 Google 試算表中，點擊頂部功能表「**延伸功能**」
2. 選擇「**Apps Script**」
3. 將開啟新分頁，顯示 Apps Script 編輯器

### 2.2 編寫後端程式碼

在 Apps Script 編輯器中，將 `Code.gs` 的預設程式碼替換為以下內容：

```javascript
// Google 試算表設定
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID'; // 替換為你的試算表 ID
const SHEET_NAME = 'Sheet1';  // 預設工作表名稱

/**
 * 初始化試算表
 * 如果試算表為空，建立標題行
 */
function initializeSheet() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  
  if (sheet.getLastRow() === 0) {
    const headers = ['ID', 'English', 'Chinese', 'Root Analysis', 'Example', 'Part of Speech', 'Created Date'];
    sheet.appendRow(headers);
  }
}

/**
 * 獲取所有單字
 * @returns {Object} 包含所有單字的物件
 */
function getAllWords() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  
  // 移除標題行
  const headers = data[0];
  const words = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[0]) { // 檢查是否有 ID
      const word = {
        id: row[0],
        english: row[1],
        chinese: row[2],
        rootAnalysis: row[3],
        example: row[4],
        partOfSpeech: row[5],
        createdDate: row[6]
      };
      words.push(word);
    }
  }
  
  return {
    success: true,
    data: words,
    count: words.length
  };
}

/**
 * 新增單字
 * @param {Object} wordData - 包含單字資料的物件
 * @returns {Object} 回應物件
 */
function addWord(wordData) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    
    // 驗證必填欄位
    if (!wordData.english || !wordData.chinese) {
      return {
        success: false,
        message: '英文單字和中文翻譯為必填欄位'
      };
    }
    
    // 生成唯一 ID（時間戳 + 隨機數）
    const id = 'WORD_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    // 獲取當前日期
    const createdDate = new Date().toLocaleString('zh-TW');
    
    // 新增行
    const newRow = [
      id,
      wordData.english,
      wordData.chinese,
      wordData.rootAnalysis || '',
      wordData.example || '',
      wordData.partOfSpeech || '',
      createdDate
    ];
    
    sheet.appendRow(newRow);
    
    return {
      success: true,
      message: '單字已成功新增',
      id: id
    };
  } catch (error) {
    return {
      success: false,
      message: '新增單字時發生錯誤: ' + error.toString()
    };
  }
}

/**
 * 更新單字
 * @param {string} id - 單字 ID
 * @param {Object} wordData - 更新的單字資料
 * @returns {Object} 回應物件
 */
function updateWord(id, wordData) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    
    // 查找對應的行
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id) {
        // 更新行資料
        sheet.getRange(i + 1, 2, 1, 6).setValues([[
          wordData.english || data[i][1],
          wordData.chinese || data[i][2],
          wordData.rootAnalysis || data[i][3],
          wordData.example || data[i][4],
          wordData.partOfSpeech || data[i][5],
          data[i][6] // 保留建立日期
        ]]);
        
        return {
          success: true,
          message: '單字已成功更新'
        };
      }
    }
    
    return {
      success: false,
      message: '找不到該單字'
    };
  } catch (error) {
    return {
      success: false,
      message: '更新單字時發生錯誤: ' + error.toString()
    };
  }
}

/**
 * 刪除單字
 * @param {string} id - 單字 ID
 * @returns {Object} 回應物件
 */
function deleteWord(id) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    
    // 查找並刪除對應的行
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id) {
        sheet.deleteRow(i + 1);
        return {
          success: true,
          message: '單字已成功刪除'
        };
      }
    }
    
    return {
      success: false,
      message: '找不到該單字'
    };
  } catch (error) {
    return {
      success: false,
      message: '刪除單字時發生錯誤: ' + error.toString()
    };
  }
}

/**
 * 處理 POST 請求（Web App 入口）
 * @param {Object} e - 事件物件
 * @returns {Object} 回應物件
 */
function doPost(e) {
  try {
    const action = e.parameter.action;
    
    switch(action) {
      case 'getAll':
        return ContentService.createTextOutput(JSON.stringify(getAllWords()))
          .setMimeType(ContentService.MimeType.JSON);
      
      case 'add':
        const wordDataAdd = JSON.parse(e.postData.contents);
        return ContentService.createTextOutput(JSON.stringify(addWord(wordDataAdd)))
          .setMimeType(ContentService.MimeType.JSON);
      
      case 'update':
        const { id: updateId, data: updateData } = JSON.parse(e.postData.contents);
        return ContentService.createTextOutput(JSON.stringify(updateWord(updateId, updateData)))
          .setMimeType(ContentService.MimeType.JSON);
      
      case 'delete':
        const { id: deleteId } = JSON.parse(e.postData.contents);
        return ContentService.createTextOutput(JSON.stringify(deleteWord(deleteId)))
          .setMimeType(ContentService.MimeType.JSON);
      
      default:
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          message: '未知的操作'
        })).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: '伺服器錯誤: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 測試函數（在編輯器中執行）
 */
function testAddWord() {
  const testData = {
    english: 'Serendipity',
    chinese: '幸運巧合',
    rootAnalysis: 'Seren + dipity',
    example: 'It was pure serendipity that we met.',
    partOfSpeech: 'n.名詞'
  };
  
  Logger.log(addWord(testData));
}

function testGetAllWords() {
  Logger.log(getAllWords());
}
```

### 2.3 替換試算表 ID

找到第 2 行的 `YOUR_SPREADSHEET_ID`，替換為你的實際試算表 ID。

---

## 第三步：部署 Apps Script 為 Web App

### 3.1 部署步驟

1. 在 Apps Script 編輯器中，點擊右上角「**部署**」按鈕
2. 選擇「**新增部署**」（或「**新建部署**」）
3. 在「**部署類型**」選擇「**Web 應用程式**」
4. 設定以下選項：
   - **執行身分**：選擇你的 Google 帳戶
   - **使用者有權限**：選擇「**任何人**」
5. 點擊「**部署**」

### 3.2 複製 Web App URL

部署完成後，會顯示一個 URL，例如：
```
https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/usercontent
```

複製此 URL，稍後在前端中使用。

### 3.3 保存部署 ID

將完整的 Web App URL 保存下來，稍後會在前端程式碼中使用。

---

## 第四步：修改前端頁面

### 4.1 建立新的管理頁面

建立新文件 `/workspaces/1/admin.html`：

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>單字管理後台</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/admin.css">
</head>
<body>
    <header>
        <nav class="navbar">
            <div class="container">
                <div class="logo">單字管理系統</div>
                <ul class="nav-menu">
                    <li><a href="index.html">回到首頁</a></li>
                    <li><a href="admin.html">管理頁面</a></li>
                </ul>
            </div>
        </nav>
    </header>

    <main>
        <div class="container">
            <!-- 新增單字表單 -->
            <section class="add-word-section">
                <h2>新增單字</h2>
                <form id="addWordForm" class="word-form">
                    <div class="form-group">
                        <label for="english">英文單字 *</label>
                        <input type="text" id="english" name="english" required placeholder="例：Serendipity">
                    </div>

                    <div class="form-group">
                        <label for="chinese">中文翻譯 *</label>
                        <input type="text" id="chinese" name="chinese" required placeholder="例：幸運巧合">
                    </div>

                    <div class="form-group">
                        <label for="rootAnalysis">字根分析</label>
                        <input type="text" id="rootAnalysis" name="rootAnalysis" placeholder="例：Seren + dipity">
                    </div>

                    <div class="form-group">
                        <label for="example">例句</label>
                        <textarea id="example" name="example" placeholder="例：It was pure serendipity that we met." rows="3"></textarea>
                    </div>

                    <div class="form-group">
                        <label for="partOfSpeech">詞性</label>
                        <select id="partOfSpeech" name="partOfSpeech">
                            <option value="">-- 選擇詞性 --</option>
                            <option value="n.名詞">n. 名詞</option>
                            <option value="v.動詞">v. 動詞</option>
                            <option value="adj.形容詞">adj. 形容詞</option>
                            <option value="adv.副詞">adv. 副詞</option>
                            <option value="prep.介詞">prep. 介詞</option>
                            <option value="conj.連詞">conj. 連詞</option>
                        </select>
                    </div>

                    <button type="submit" class="btn btn-primary">儲存單字</button>
                </form>
            </section>

            <!-- 單字列表 -->
            <section class="words-list-section">
                <h2>單字列表</h2>
                <div id="loadingSpinner" class="loading">載入中...</div>
                <div id="wordsList" class="words-list"></div>
            </section>
        </div>
    </main>

    <footer>
        <div class="container">
            <p>&copy; 2024 單字管理系統。版權所有。</p>
        </div>
    </footer>

    <script src="js/admin.js"></script>
</body>
</html>
```

### 4.2 建立管理頁面樣式

建立新文件 `/workspaces/1/css/admin.css`：

```css
/* 管理頁面樣式 */

.add-word-section {
    background-color: #fff;
    padding: 40px 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    margin: 40px 0;
}

.add-word-section h2 {
    color: var(--secondary-color);
    margin-bottom: 30px;
    font-size: 28px;
}

.word-form {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-bottom: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group label {
    margin-bottom: 8px;
    font-weight: 600;
    color: var(--secondary-color);
}

.form-group input,
.form-group select,
.form-group textarea {
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: var(--border-radius);
    font-family: inherit;
    font-size: 14px;
    transition: var(--transition);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
}

.form-group textarea {
    resize: vertical;
    grid-column: 1 / -1;
}

.word-form button {
    grid-column: 1 / -1;
    align-self: center;
    max-width: 300px;
    margin: 0 auto;
}

.btn-primary {
    background-color: var(--primary-color);
}

.btn-primary:hover {
    background-color: #2980b9;
}

.btn-danger {
    background-color: var(--accent-color);
    padding: 8px 16px;
    font-size: 14px;
}

.btn-danger:hover {
    background-color: #c0392b;
}

/* 單字列表 */
.words-list-section {
    padding: 40px 20px;
    margin: 40px 0;
}

.words-list-section h2 {
    color: var(--secondary-color);
    margin-bottom: 30px;
    font-size: 28px;
}

.loading {
    text-align: center;
    padding: 40px;
    color: #999;
    font-size: 18px;
}

.words-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 20px;
}

.word-card {
    background-color: #fff;
    border: 1px solid #e0e0e0;
    border-left: 4px solid var(--primary-color);
    border-radius: var(--border-radius);
    padding: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    transition: var(--transition);
}

.word-card:hover {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
}

.word-card h3 {
    color: var(--primary-color);
    font-size: 22px;
    margin-bottom: 10px;
}

.word-item {
    margin-bottom: 12px;
    font-size: 14px;
    line-height: 1.6;
}

.word-item strong {
    color: var(--secondary-color);
    display: inline-block;
    min-width: 80px;
}

.word-item span {
    color: #333;
}

.word-card-actions {
    display: flex;
    gap: 10px;
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #eee;
}

.word-card-actions button {
    flex: 1;
    padding: 8px 12px;
    font-size: 13px;
}

.empty-message {
    grid-column: 1 / -1;
    text-align: center;
    padding: 40px;
    color: #999;
    font-size: 16px;
}

/* 響應式 */
@media (max-width: 768px) {
    .word-form {
        grid-template-columns: 1fr;
    }

    .words-list {
        grid-template-columns: 1fr;
    }

    .form-group textarea {
        grid-column: auto;
    }

    .word-form button {
        grid-column: auto;
    }
}
```

### 4.3 建立管理頁面 JavaScript

建立新文件 `/workspaces/1/js/admin.js`：

```javascript
// 替換為你的 Google Apps Script Web App URL
const APPS_SCRIPT_URL = 'https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/usercontent';

// 頁面初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('管理頁面已加載');
    initializeAdminPage();
});

// 初始化管理頁面
function initializeAdminPage() {
    const addWordForm = document.getElementById('addWordForm');
    if (addWordForm) {
        addWordForm.addEventListener('submit', handleAddWord);
    }
    
    // 加載單字列表
    loadWordsList();
}

// 處理新增單字
function handleAddWord(e) {
    e.preventDefault();
    
    // 獲取表單數據
    const wordData = {
        english: document.getElementById('english').value.trim(),
        chinese: document.getElementById('chinese').value.trim(),
        rootAnalysis: document.getElementById('rootAnalysis').value.trim(),
        example: document.getElementById('example').value.trim(),
        partOfSpeech: document.getElementById('partOfSpeech').value
    };
    
    // 驗證必填欄位
    if (!wordData.english || !wordData.chinese) {
        showNotification('請填寫英文單字和中文翻譯', 'error');
        return;
    }
    
    // 禁用提交按鈕
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = '儲存中...';
    
    // 發送到 Apps Script
    sendToAppsScript('add', wordData)
        .then(response => {
            if (response.success) {
                showNotification('單字已成功新增！', 'success');
                e.target.reset();
                loadWordsList(); // 重新載入列表
            } else {
                showNotification(response.message || '新增失敗', 'error');
            }
        })
        .catch(error => {
            console.error('錯誤:', error);
            showNotification('發生錯誤，請稍後重試', 'error');
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = '儲存單字';
        });
}

// 加載單字列表
function loadWordsList() {
    const wordsList = document.getElementById('wordsList');
    const loadingSpinner = document.getElementById('loadingSpinner');
    
    loadingSpinner.style.display = 'block';
    wordsList.innerHTML = '';
    
    sendToAppsScript('getAll')
        .then(response => {
            loadingSpinner.style.display = 'none';
            
            if (response.success && response.data.length > 0) {
                displayWordsList(response.data);
            } else {
                wordsList.innerHTML = '<div class="empty-message">暫無單字記錄</div>';
            }
        })
        .catch(error => {
            console.error('載入錯誤:', error);
            loadingSpinner.style.display = 'none';
            wordsList.innerHTML = '<div class="empty-message">載入失敗，請稍後重試</div>';
        });
}

// 顯示單字列表
function displayWordsList(words) {
    const wordsList = document.getElementById('wordsList');
    wordsList.innerHTML = '';
    
    words.forEach(word => {
        const wordCard = document.createElement('div');
        wordCard.className = 'word-card';
        wordCard.innerHTML = `
            <h3>${escapeHtml(word.english)}</h3>
            <div class="word-item">
                <strong>中文：</strong>
                <span>${escapeHtml(word.chinese)}</span>
            </div>
            <div class="word-item">
                <strong>詞性：</strong>
                <span>${escapeHtml(word.partOfSpeech) || '未分類'}</span>
            </div>
            <div class="word-item">
                <strong>字根：</strong>
                <span>${escapeHtml(word.rootAnalysis) || '無'}</span>
            </div>
            <div class="word-item">
                <strong>例句：</strong>
                <span>${escapeHtml(word.example) || '無'}</span>
            </div>
            <div class="word-item">
                <strong>日期：</strong>
                <span>${escapeHtml(word.createdDate)}</span>
            </div>
            <div class="word-card-actions">
                <button class="btn btn-danger" onclick="deleteWord('${word.id}')">刪除</button>
            </div>
        `;
        wordsList.appendChild(wordCard);
    });
}

// 刪除單字
function deleteWord(id) {
    if (!confirm('確定要刪除這個單字嗎？')) {
        return;
    }
    
    sendToAppsScript('delete', { id: id })
        .then(response => {
            if (response.success) {
                showNotification('單字已刪除', 'success');
                loadWordsList();
            } else {
                showNotification(response.message || '刪除失敗', 'error');
            }
        })
        .catch(error => {
            console.error('刪除錯誤:', error);
            showNotification('刪除失敗，請稍後重試', 'error');
        });
}

// 發送請求到 Apps Script
function sendToAppsScript(action, data = null) {
    let url = APPS_SCRIPT_URL + '?action=' + action;
    let options = {
        method: 'POST',
        mode: 'no-cors'
    };
    
    if (data) {
        options.body = JSON.stringify(data);
        options.headers = {
            'Content-Type': 'application/json'
        };
    }
    
    return fetch(url, options)
        .then(response => response.text())
        .then(text => {
            try {
                return JSON.parse(text);
            } catch (e) {
                console.error('解析回應失敗:', text);
                throw new Error('伺服器回應格式錯誤');
            }
        });
}

// HTML 逃脫函數（防止 XSS）
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// 顯示通知
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background-color: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
```

### 4.4 更新首頁以讀取 Google 試算表

編輯 `/workspaces/1/js/script.js`，在最開始添加以下內容：

```javascript
// Google Apps Script URL（替換為你的）
const APPS_SCRIPT_URL = 'https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/usercontent';
```

然後在 `initializeEventListeners()` 函數中添加：

```javascript
// 在 setupSmoothScroll(); 之前添加
loadWordsFromSpreadsheet();
```

在文件末尾添加以下函數：

```javascript
// 從 Google 試算表載入單字
function loadWordsFromSpreadsheet() {
    fetch(APPS_SCRIPT_URL + '?action=getAll', {
        method: 'POST',
        mode: 'no-cors'
    })
    .then(response => response.text())
    .then(text => {
        try {
            const data = JSON.parse(text);
            if (data.success && data.data.length > 0) {
                console.log('載入的單字:', data.data);
                // 這裡可以實現如何在卡片中顯示單字
                displayRandomWord(data.data);
            }
        } catch (e) {
            console.error('解析失敗:', e);
        }
    })
    .catch(error => console.error('載入錯誤:', error));
}

// 顯示隨機單字
function displayRandomWord(words) {
    if (words.length === 0) return;
    
    const randomWord = words[Math.floor(Math.random() * words.length)];
    console.log('隨機單字:', randomWord);
    
    // 可以在這裡實現如何在頁面上顯示單字
    // 例如在 hero section 或其他位置
}
```

---

## 第五步：測試整合

### 5.1 測試 Apps Script

1. 在 Apps Script 編輯器中，點擊「**執行**」按鈕
2. 選擇要執行的函數：
   - `testAddWord` - 測試新增單字
   - `testGetAllWords` - 測試獲取所有單字
3. 檢查執行紀錄中的輸出

### 5.2 測試管理頁面

1. 在瀏覽器中打開 `http://localhost:8000/admin.html`
2. 填寫新增單字表單
3. 點擊「儲存單字」按鈕
4. 檢查是否顯示成功訊息
5. 重新整理頁面，檢查單字是否出現在列表中

### 5.3 檢查 Google 試算表

打開 Google 試算表，確認新增的單字已寫入。

### 5.4 常見問題排查

| 問題 | 解決方案 |
|------|--------|
| 403 Forbidden 錯誤 | 檢查 Apps Script 部署權限是否設為「任何人」 |
| CORS 錯誤 | 這是正常的，使用 `mode: 'no-cors'` 可解決 |
| 無法獲取數據 | 檢查 APPS_SCRIPT_URL 是否正確 |
| 試算表無法寫入 | 檢查試算表是否共享，且部署身分是否正確 |

---

## 📋 檢查清單

在部署前，確保完成以下所有步驟：

- [ ] 建立 Google 試算表並配置欄位
- [ ] 獲取並保存試算表 ID
- [ ] 編寫 Apps Script 代碼
- [ ] 將 Apps Script URL 替換到程式碼中
- [ ] 部署 Apps Script 為 Web App
- [ ] 複製並保存 Web App URL
- [ ] 更新前端頁面（index.html、admin.html）
- [ ] 更新 JavaScript 文件（admin.js、script.js）
- [ ] 更新 CSS 文件（admin.css）
- [ ] 測試新增單字功能
- [ ] 測試載入單字列表
- [ ] 測試刪除單字功能
- [ ] 驗證 Google 試算表已更新

---

## 🔐 安全性建議

1. **驗證輸入** - 總是驗證前端和後端的輸入
2. **防止 XSS** - 使用 `escapeHtml()` 函數轉義用戶輸入
3. **限制存取** - 如果需要，可以在 Apps Script 中添加身份驗證
4. **備份數據** - 定期備份 Google 試算表

---

## 📚 相關文件

- [Google Apps Script 文檔](https://developers.google.com/apps-script)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Fetch API 文檔](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

---

## 🎉 完成！

完成以上所有步驟後，你將擁有一個完整的單字管理系統，能夠：
- ✅ 在 Google 試算表中儲存單字
- ✅ 通過管理頁面新增/刪除單字
- ✅ 在首頁讀取和顯示單字
- ✅ 實時同步數據

祝開發順利！
