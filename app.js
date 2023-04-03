var serviceKeyStr = "yVuS2h%2Fn6vH7khxL68QEYxgERpm6yXqauRIDptTSGqAlehwhW5E4PQ9CJO4y%2FoxGujJHRXd3H8D%2BOuv5Vfhldw%3D%3D";
var stockData;
var stockIndex;

function OutPutString(message, style, mode)
{
    var resultDiv = document.getElementById(mode);
    if (style)
        resultDiv.innerHTML = '<b><font color=red>' + message + '</font></b>';
    else
        resultDiv.innerHTML = message;
}

function GetStockData(){
    // alert("데이터 getting...")
    OutPutString("데이터 getting...", true, 'result0');
    LoadData("http://apis.data.go.kr/1160100/service/GetStocDiviInfoService/getDiviInfo?pageNo=1&numOfRows=1&resultType=json&stckIssuCmpyNm=" +
    encodeURI(document.getElementById('Input-stock-name').value) + "&scrsItmsKcdNm=" + encodeURI(document.getElementById('Input-stock-type').value) + "&serviceKey=" + serviceKeyStr, 0);
}

function LoadData(url, mode) {
    $.ajax({
        crossOrigin: true,
        proxy: "proxy.php",
        dataType: "json",
        url: url,
        success: function(data) {
            try
            {
                if (mode == 0) // 주식배당정보
                    ParseJSON0(data);
 
            } catch (e) {
                if (mode == 0) // 주식배당정보
                    OutPutString('<b>주식배당정보<br />데이터를 가져오는 동안 오류가 발생하였습니다.</b><br />' + e, false, 'result0');
            }
        }
    });
}

function ParseJSON0(data) {
    const obj = JSON.parse(data);
    item = obj.response.body.items.item[0];
    if (item === undefined)
    {
        OutPutString('<b>주식배당정보 데이터가 없습니다.</b>', false, 'result0');
    }
    else
    {
        OutPutString('<b>' + item.stckIssuCmpyNm + ' ' + item.scrsItmsKcdNm + '</b><br />' +
        '<p><b>주식정보</b>' + '<br />' +
        '법인등록번호　　　　　: ' + item.crno + '<br />' +
        '주식발행회사명　　　　: ' + item.stckIssuCmpyNm + '<br />' +
        '국제증권식별번호코드　: ' + item.isinCd + '<br />' +
        '국제증권식별번호코드명: ' + item.isinCdNm + '<br />' +
        '유가증권종목종류코드　: ' + item.scrsItmsKcd + '<br />' +
        '유가증권종목종류코드명: ' + item.scrsItmsKcdNm + '<br />' +
        '주식액면가　　　　　　: ' + new Intl.NumberFormat().format(item.stckParPrc) + '원</p>' +
        '<b>주식배당정보</b>' + '<br />' +
        '기준일자　　　　　　　　: ' + ParseDate(item.basDt) + '<br />' +
        '배당기준일자　　　　　　: ' + ParseDate(item.dvdnBasDt) + '<br />' +
        '현금배당지급일자　　　　: ' + ParseDate(item.cashDvdnPayDt) + '<br />' +
        '주식교부일자　　　　　　: ' + ParseDate(item.stckHndvDt) + '<br />' +
        '주식배당사유코드　　　　: ' + item.stckDvdnRcd + '<br />' +
        '주식배당사유코드명　　　: ' + item.stckDvdnRcdNm + '<br />' +
        '명의개서대리인구분코드　: ' + item.trsnmDptyDcd + '<br />' +
        '명의개서대리인구분코드명: ' + item.trsnmDptyDcdNm + '<br />' +
        '주식일반배당금액　　　　: ' + new Intl.NumberFormat().format(item.stckGenrDvdnAmt) + '원<br />' +
        '주식차등배당금액　　　　: ' + new Intl.NumberFormat().format(item.stckGrdnDvdnAmt) + '원<br />' +
        '주식일반현금배당률　　　: ' + item.stckGenrCashDvdnRt + '<br />' +
        '주식일반배당률　　　　　: ' + item.stckGenrDvdnRt + '<br />' +
        '현금차등배당률　　　　　: ' + item.cashGrdnDvdnRt + '<br />' +
        '주식차등배당률　　　　　: ' + item.stckGrdnDvdnRt + '<br />' +
        '주식결산월일　　　　　　: ' + item.stckStacMd
        , false, 'result0');
    }
}
