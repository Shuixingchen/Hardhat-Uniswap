import Database from "./plugins/db/DB";
import HttpClient from "./plugins/httpclient/http"

function useDB() {
    const db = new Database({
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'explorer-flink',
        port: 3306
    })
    db.query("select * from flink_task").then((rows)=>{
        console.log(rows)
    }).catch((err)=>{
        console.log(err)
    })
}

async function useHttp() {
    const client = new HttpClient();
    client.addBeforeRequestHook((options) => {
    options.headers = { 'Content-Type': 'application/json' };
        return options;
    });
    client.addAfterResponseHook((response) => {
        console.log(response.body);
        return response;
    });
const response = await client.request({
  url: 'https://baidu.com',
  method: 'GET',
});
console.log(response.status); // 200
console.log(response.headers); // { "Content-Type": "application/json" }
console.log(response.body); // { "id": 123, "name": "Alice", "age": 20 }
}


useHttp();