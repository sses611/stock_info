import { GetStoreList } from "./stock.js";
import { LoadData } from "./stock.js";
import { ChartInit } from "./stock.js";

$(document).ready(function(){

})

$('.button').click(function(){
    console.log('app.js 데이터가져오기로 했다.');
    GetStoreList();
})

export function OutPutString(message, style, mode)
{
    var resultDiv = document.getElementById(mode);
    if (style)
        resultDiv.innerHTML = '<b><font color=red>' + message + '</font></b>';
    else
        resultDiv.innerHTML = message;
}
