# 我的前端網站

這是一個使用純 **HTML、CSS 和 JavaScript** 構建的現代化網站，無任何框架依賴。

## 📁 項目結構

```
/
├── index.html          # 主頁面（HTML 結構）
├── css/
│   └── style.css       # 樣式表（CSS 樣式）
├── js/
│   └── script.js       # JavaScript 腳本（交互功能）
├── images/             # 圖像資源文件夾
└── README.md           # 項目說明
```

## ✨ 功能特性

- ✅ **響應式設計** - 適配所有設備（桌面、平板、手機）
- ✅ **平滑動畫** - 頁面加載和滾動動畫效果
- ✅ **導航菜單** - 粘性導航欄和平滑滾動
- ✅ **聯絡表單** - 表單驗證和用戶反饋
- ✅ **現代 UI/UX** - 美觀的配色方案和組件設計
- ✅ **交互功能** - 按鈕、表單提交、通知提示

## 🚀 快速開始

### 1. 在本地運行

最簡單的方法是使用 VS Code 的 Live Server 擴展：

1. 安裝 **Live Server** 擴展
2. 右鍵點擊 `index.html`
3. 選擇 **Open with Live Server**

或者使用 Python 簡易服務器：

```bash
# Python 3
python -m http.server 8000

# 然後訪問 http://localhost:8000
```

### 2. 項目頁面

- **首頁 (Hero Section)** - 歡迎頁面
- **關於** - 項目介紹
- **服務** - 服務卡片展示
- **聯絡** - 聯絡表單

## 📝 文件說明

### index.html
- 定義頁面結構
- 5 個主要區塊：Header、Hero、About、Services、Contact、Footer
- 語義化 HTML 標記

### css/style.css
- 採用 CSS 變數（CSS Variables）
- Grid 和 Flexbox 布局
- 響應式設計斷點
- 平滑動畫和過渡效果

### js/script.js
- 表單驗證
- 事件處理
- Intersection Observer API 用於滾動動畫
- 用戶通知系統

## 🎨 自訂樣式

編輯 `css/style.css` 中的 CSS 變數來快速更改主題：

```css
:root {
    --primary-color: #3498db;        /* 主顏色 */
    --secondary-color: #2c3e50;      /* 次顏色 */
    --accent-color: #e74c3c;         /* 強調顏色 */
    --light-color: #ecf0f1;          /* 亮色 */
    --dark-color: #2c3e50;           /* 深色 */
}
```

## 📱 響應式斷點

- **1200px** - 桌面標準
- **768px** - 平板設備
- **480px** - 手機設備

## 🔧 擴展功能建議

想要進一步增強網站，可以考慮：

1. **添加更多頁面** - 創建新的 HTML 文件
2. **圖像優化** - 添加高質量圖像到 `images/` 文件夾
3. **數據持久化** - 使用 LocalStorage 儲存用戶數據
4. **API 集成** - 連接後端 API 以獲取動態數據
5. **SEO 優化** - 添加 Meta 標籤和結構化數據
6. **性能優化** - 壓縮圖像和代碼

## 📚 技術棧

- **HTML5** - 語義化標記
- **CSS3** - 現代 CSS 特性
- **Vanilla JavaScript** - 純 JavaScript，無依賴

## 💡 學習資源

- [MDN Web Docs](https://developer.mozilla.org/)
- [CSS-Tricks](https://css-tricks.com/)
- [JavaScript.info](https://javascript.info/)

## 📄 許可證

此項目可自由使用和修改。

---

**祝您網站開發愉快！** 🎉