import { GetStoreList } from "./stock.js";
import { LoadData } from "./stock.js";
import { ChartInit } from "./stock.js";

window.onload = function (){
    init();
}

export function OutPutString(message, style, mode)
    {
        var resultDiv = document.getElementById(mode);
        if (style)
            resultDiv.innerHTML = '<b><font color=red>' + message + '</font></b>';
        else
            resultDiv.innerHTML = message;
}

function init(){
    $('.button').click(function(){
        console.log('app.js 데이터가져오기로 했다.');
        GetStoreList();
    })

    
    function PrevData() {
        if (9 > stockIndex) stockIndex += 1;
        else stockIndex = 9;
        ParseJSON2(stockData, stockIndex);
    }

    function NextData() {
        if (stockIndex > 0) stockIndex -= 1;
        else stockIndex = 0;
        ParseJSON2(stockData, stockIndex);
    }


}

