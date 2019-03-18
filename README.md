# SimpleTodoAppDemoServer
It's server side code for running  Simple Todo App


## Intro
可以整合Todo事件到Google Calendar的app，模型區分為TodoDetail與TodoSummary兩種，使未來TodoDetail的部分可以有更多細節擴充。
結合Express, MongoDB, Mongoose

## Quickstart
若有取得額外zip的壓縮檔，請直接解壓縮。
將兩個與google calendar權限相關檔案(client_secret.json,credentials.json)，
與一個build資料夾，放於此根目錄底下。
不過這個狀況，calendar會同步到某個我的帳號，因此外面的人會無法確認是否新增到calendar成功。
要連到自己的請參考Personal Google Calendar Authentication段落

##### Install

    $ git clone https://github.com/hategold/SimpleTodoAppDemoServer.git
    $ cd SimpleTodoAppDemoServer
    $ npm install
    $ nodemon server
    Then you can access into http://localhost:4000 

##### DB Connection
預設使用mongodb://127.0.0.1:27017/todos作為DB Connection
可於以下地方修改
```js
    mongoose.connect('mongodb://127.0.0.1:27017/todos', { useNewUrlParser: true });//server.js(13)
```
也可進入mondodb執行以下指令產生database(27017 port是預設值)<br/>
`
use todos
`

## Personal Google Calendar Authentication
* Check [here](https://console.developers.google.com/flows/enableapi?apiid=calendar).
* 產生Project, 並且啟用Google Calendar (資料庫 Library) 
* 到 憑證 頁面
* 新增憑證，在詢問哪類憑證時先選擇Cancel跳出
* 從頁面上方按鈕重選憑證 用OAuth ID的選項
* Application type 選為 Other,記得輸入App名稱，之後產生憑證.
* 下載該憑證JSON檔案
* 將該檔案放到此根目錄下，命名為client_secret.json
* 啟server，第一次用到Api的時候會要求Token
* 透過Server Console給的網址登入並確定，取回資料後輸入Server Console
* credentials.json 自動產生


