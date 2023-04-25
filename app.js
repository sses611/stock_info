var req_url = 'http://apis.data.go.kr/1160100/service/GetStocDiviInfoService/getDiviInfo'
var serviceKeyStr = "yVuS2h%2Fn6vH7khxL68QEYxgERpm6yXqauRIDptTSGqAlehwhW5E4PQ9CJO4y%2FoxGujJHRXd3H8D%2BOuv5Vfhldw%3D%3D"



function GetStoreList() {
    LoadData(req_url+"?pageNo=1&numOfRows=1&resultType=json&stckIssuCmpyNm=" +
    encodeURI(document.getElementById('Stockname').value) + "&scrsItmsKcdNm=" + 
    encodeURI(document.getElementById('Stocktype').value) + "&serviceKey=" + serviceKeyStr, 0);
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
                    SelectStockDiv(data);
                else if (mode == 1) // 주식발행정보
                    SelectStockIssuance(data);
                else if (mode == 2) // 주식시세정보
                {
                    stockData = data;
                    stockIndex = 0;
                    SelectStockQuote(stockData, stockIndex);
                }
                
            } catch (e) {
                if(mode == -1)
                    OutPutString('<b>주식정보<br />데이터를 가져오는 동안 오류가 발생하였습니다.</b><br />' + e, false, 'result11');
                else if (mode == 0) // 주식배당정보
                    OutPutString('<b>주식배당정보<br />데이터를 가져오는 동안 오류가 발생하였습니다.</b><br />' + e, false, 'result0');
                else if (mode == 1) // 주식발행정보
                    OutPutString('<b>주식발행정보<br />데이터를 가져오는 동안 오류가 발생하였습니다.</b><br />' + e, false, 'result1');
                else if (mode == 2) // 주식시세정보
                    OutPutString('<b>주식시세정보<br />데이터를 가져오는 동안 오류가 발생하였습니다.</b><br />' + e, false, 'result2');
            }
        }
    });
}

function SelectStockDiv(data) {
    item = data.response.body.items.item[0];

    if (item === undefined)
    {
        OutPutString('<b>주식배당정보 데이터가 없습니다.</b>', false, 'result0');
        OutPutString('<b>주식발행정보 데이터가 없습니다.</b>', false, 'result1');
        OutPutString('<b>주식시세정보 데이터가 없습니다.</b>', false, 'result2');
    }
    else
    {
        OutPutString('<b>' + item.stckIssuCmpyNm + ' ' + item.scrsItmsKcdNm + '</b><br />' +
        '<><ul class="stock-info">주식정보</ul>' + '<br /></li>' +
        '<li>법인등록번호　　　　　: ' + item.crno + '<br /></li>' +
        '<li>주식발행회사명　　　　: ' + item.stckIssuCmpyNm + '<br /></li>' +
        '<li>국제증권식별번호코드　: ' + item.isinCd + '<br /></li>' +
        '<li>국제증권식별번호코드명: ' + item.isinCdNm + '<br /></li>' +
        '<li>유가증권종목종류코드　: ' + item.scrsItmsKcd + '<br /></li>' +
        '<li>유가증권종목종류코드명: ' + item.scrsItmsKcdNm + '<br /></li>' +
        '<b class="stock-info">주식배당정보</b>' + '<br />' +
        '<li>기준일자　　　　　　　　: ' + ParseDate(item.basDt) + '<br /></li>' +
        '<li>배당기준일자　　　　　　: ' + ParseDate(item.dvdnBasDt) + '<br /></li>' +
        '<li>현금배당지급일자　　　　: ' + ParseDate(item.cashDvdnPayDt) + '<br /></li>' +
        '<li>주식교부일자　　　　　　: ' + ParseDate(item.stckHndvDt) + '<br /></li>' +
        '<li>주식배당사유코드　　　　: ' + item.stckDvdnRcd + '<br /></li>' +
        '<li>주식배당사유코드명　　　: ' + item.stckDvdnRcdNm + '<br /></li>' +
        '<li>명의개서대리인구분코드　: ' + item.trsnmDptyDcd + '<br /></li>' +
        '<li>명의개서대리인구분코드명: ' + item.trsnmDptyDcdNm + '<br /></li>' +
        '<li>주식일반배당금액　　　　: ' + new Intl.NumberFormat().format(item.stckGenrDvdnAmt) + '원<br /></li>' +
        '<li>주식차등배당금액　　　　: ' + new Intl.NumberFormat().format(item.stckGrdnDvdnAmt) + '원<br /></li>' +
        '<li>주식일반현금배당률　　　: ' + item.stckGenrCashDvdnRt + '<br /></li>' +
        '<li>주식일반배당률　　　　　: ' + item.stckGenrDvdnRt + '<br /></li>' +
        '<li>현금차등배당률　　　　　: ' + item.cashGrdnDvdnRt + '<br /></li>' +
        '<li>주식차등배당률　　　　　: ' + item.stckGrdnDvdnRt + '<br /></li>' +
        '<li>주식결산월일　　　　　　: ' + item.stckStacMd+ '</li>'
        , false, 'result0');

        // 금융위원회_주식발행정보
        LoadData("http://apis.data.go.kr/1160100/service/GetStocIssuInfoService/getItemBasiInfo?pageNo=1&numOfRows=1&resultType=json&crno=" + item.crno + "&isinCd=" + item.isinCd + "&serviceKey=" + serviceKeyStr, 1);

        // 금융위원회_주식시세정보
        LoadData("http://api.odcloud.kr/api/GetStockSecuritiesInfoService/v1/getStockPriceInfo?resultType=json&isinCd=" + item.isinCd + "&serviceKey=" + serviceKeyStr, 2);
    }
}

function SelectStockIssuance(data) {
    item = data.response.body.items.item[0];
    if (item === undefined)
        OutPutString('<b>주식발행정보 데이터가 없습니다.</b>', false, 'result1');
    else
        OutPutString('<b class="stock-info">주식발행정보</b>' + '<br />' +
        '기준일자　　　: ' + ParseDate(item.basDt) + '<br />' +
        '발행주식수　　: ' + new Intl.NumberFormat().format(item.issuStckCnt) + '주<br />' +
        '상장일자　　　: ' + ParseDate(item.lstgDt) + '<br />' +
        '상장폐지일자　: ' + ParseDate(item.lstgAbolDt) + '<br />' +
        '예탁등록일자　: ' + ParseDate(item.dpsgRegDt) + '<br />' +
        '예탁취소일자　: ' + ParseDate(item.dpsgCanDt) + '<br />' +
        '발행형태구분명: ' + item.issuFrmtClsfNm
        , false, 'result1');
}

function SelectStockQuote(data, id) {
    item = data.response.body.items.item[id];
    if (item === undefined)
        OutPutString('<b>주식시세정보 데이터가 없습니다.</b>', false, 'result2');
    else
    {
        OutPutString('<b class="stock-info">주식시세정보</b>' + '<br />' +
        '기준일자　: ' + ParseDate(item.basDt) + '<br />' +
        '종목코드　: ' + item.srtnCd + '<br />' +
        '표준코드　: ' + item.isinCd + '<br />' +
        '종목이름　: ' + item.itmsNm + '<br />' +
        '시장구분　: ' + item.mrktCtg + '<br />' +
        '상장주식수: ' + new Intl.NumberFormat().format(item.lstgStCnt) + '주<br />' +
        '시가총액　: ' + new Intl.NumberFormat().format(item.mrktTotAmt) + '원<br />' +
        '종가　　　: ' + new Intl.NumberFormat().format(item.clpr) + '원<br />' +
        '전일비　　: ' + new Intl.NumberFormat().format(item.vs) + '원<br />' +
        '등락률　　: ' + item.fltRt + '%<br />' +
        '시가　　　: ' + new Intl.NumberFormat().format(item.mkp) + '원<br />' +
        '고가　　　: ' + new Intl.NumberFormat().format(item.hipr) + '원<br />' +
        '저가　　　: ' + new Intl.NumberFormat().format(item.lopr) + '원<br />' +
        '거래량　　: ' + new Intl.NumberFormat().format(item.trqu) + '주<br />' +
        '거래대금　: ' + new Intl.NumberFormat().format(item.trPrc) + '원<br />' +
        '<br /><button class="button" onclick="PrevData();">이전 날짜</button> <button class="button" onclick="NextData();">다음 날짜</button>'
        , false, 'result2');

        var labelArr = [];
        for (var i=id; i>=0; i--) {
           labelArr.push(ParseDate(data.response.body.items.item[i].basDt));
        }
        var dataArr = [];
        for (var i=id; i>=0; i--) {
           dataArr.push(data.response.body.items.item[i].clpr);
        }

        ChartInit(); // 차트초기화

        new Chart(document.getElementById("line-chart"), {
            type: 'line',
            data: {
                labels: labelArr,
                datasets: [{
                    data: dataArr,
                    label: item.itmsNm,
                    borderColor: "#ff0000",
                    fill: true
                }]
            },
            options: {
                title: {
                    display: true,
                    text: '기준일자: ' + ParseDate(item.basDt)
                }
            }
        });
    }
}
