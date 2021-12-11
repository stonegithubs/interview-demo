Nodejs version 14.17.0
NPM version 7.14.0

```shell
npm i
# 開發(terminal 1 必要)
npm run watch-ts

# 開發(terminal 2)
npm run dev

# 啟動bull board
npm run dev-bull

# 新增migration
typeorm migration:create -n xxxMigration
```

```
// 檔案 .env
BULL_BOARD_PORT=5002
REDIS_DSN=redis://127.0.0.1:6379
```
