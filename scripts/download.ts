// https://github.com/leoshiang/get-taiwan-poi

import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import syncFetch from "sync-fetch";

const parser = new XMLParser();

const 首頁網址 = "https://emap.pcsc.com.tw/lib/areacode.js";
const ApiUrl = "https://emap.pcsc.com.tw/EMapSDK.aspx";

let ApiParams = {
  credentials: "include",
  headers: {
    Accept: "*/*",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "X-Requested-With": "XMLHttpRequest",
  },
  referrer: "https://emap.pcsc.com.tw/emap.aspx",
  method: "POST",
  mode: "cors",
  body: "",
};

let stores = [];

for (const 縣市 of 擷取縣市資料(取得網頁資料(首頁網址))) {
  for (const 鄉鎮 of 解析MapSdkXML(取得鄉鎮列表(縣市.代碼))) {
    for (const store of 解析MapSdkXML(取得門市列表(縣市.名稱, 鄉鎮.TownName))) {
      stores.push({
        address: store.Address,
        lon: store.X * 0.000001,
        lat: store.Y * 0.000001,
      });
    }
  }
}

fs.writeFileSync("stores.json", JSON.stringify(stores), { flag: "w" });

function 取得網頁資料(網址: string, 參數?: any) {
  return syncFetch(網址, 參數 || {}).text();
}

function 擷取縣市資料(JS程式: any) {
  let result = [];
  const regex = /new AreaNode\('(.*)'.* '(\d+)'\)/g;
  let match = null;
  while ((match = regex.exec(JS程式))) {
    result.push({
      名稱: match[1],
      代碼: match[2],
    });
  }
  return result;
}

function 取得鄉鎮列表(縣市代碼: string) {
  ApiParams.body = `commandid=GetTown&cityid=${縣市代碼}&leftMenuChecked=`;
  return 取得網頁資料(ApiUrl, ApiParams);
}

function 取得門市列表(縣市名稱: string, 鄉鎮名稱: string) {
  ApiParams.body = `commandid=SearchStore&city=${縣市名稱}&town=${鄉鎮名稱}`;
  return 取得網頁資料(ApiUrl, ApiParams);
}

function 解析MapSdkXML(XML: any) {
  const 位置列表 = parser.parse(XML);
  if (!位置列表.iMapSDKOutput) {
    return [];
  }
  if (!位置列表.iMapSDKOutput.GeoPosition) {
    return [];
  }
  const result = 位置列表.iMapSDKOutput.GeoPosition;
  return 取得型別(result) === "Array" ? result : [result];
}

function 取得型別(obj: any) {
  return Object.prototype.toString.call(obj).slice(8, -1);
}
