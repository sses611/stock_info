var req_url = 'http://apis.data.go.kr/1160100/service/GetStocDiviInfoService/getDiviInfo'
var serviceKeyStr = "yVuS2h%2Fn6vH7khxL68QEYxgERpm6yXqauRIDptTSGqAlehwhW5E4PQ9CJO4y%2FoxGujJHRXd3H8D%2BOuv5Vfhldw%3D%3D"

function OutPutString(message, flag, tag)
{
    var resultDiv = document.getElementById(tag);
    if (flag)
        resultDiv.innerHTML = '<b>' + message + '</b>';
    else    
        resultDiv.innerHTML = message;
}


function ChartInit() {
    // 차트 초기화
    $('#line-chart').remove();
    $('iframe.chartjs-hidden-iframe').remove();
    $('.chart-container').append('<canvas id="line-chart"></canvas>');
}

function GetStoreList() {
    OutPutString('데이터를 가져오고 있습니다.', true, 'result0');
    OutPutString('', true, 'result1');
    OutPutString('', true, 'result2');

    
    ChartInit(); // 차트초기화


    //금융위원회_주식배당정보
    LoadData(req_url+"?pageNo=1&numOfRows=1&resultType=json&stckIssuCmpyNm=" +
    encodeURI(document.getElementById('Stockname').value) + "&scrsItmsKcdNm=" + encodeURI(document.getElementById('Stocktype').value) + "&serviceKey=" + serviceKeyStr, 0);
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
                else if (mode == 1) // 주식발행정보
                    ParseJSON1(data);
                else if (mode == 2) // 주식시세정보
                {
                    stockData = data;
                    stockIndex = 0;
                    ParseJSON2(stockData, stockIndex);
                }
                
            } catch (e) {
                if(mode == -1)
                    OutPutString('<b>주식정보데이터를 가져오는 동안 오류가 발생하였습니다.</b>' + e, false, 'result11');
                else if (mode == 0) // 주식배당정보
                    OutPutString('<b>주식배당정보데이터를 가져오는 동안 오류가 발생하였습니다.</b>' + e, false, 'result0');
                else if (mode == 1) // 주식발행정보
                    OutPutString('<b>주식발행정보데이터를 가져오는 동안 오류가 발생하였습니다.</b>' + e, false, 'result1');
                else if (mode == 2) // 주식시세정보
                    OutPutString('<b>주식시세정보데이터를 가져오는 동안 오류가 발생하였습니다.</b>' + e, false, 'result2');
            }
        }
    });
}

function ParseDate(str) {
    var y = str.substr(0, 4);
    var m = str.substr(4, 2);
    var d = str.substr(6, 2);
    return y + '년 ' + m + '월 ' + d + '일';
}
function ParseJSON0(data) {
    item = data.response.body.items.item[0];
    var Stitle = document.getElementById('stock-title');
    Sname = item.stckIssuCmpyNm + ' ' + item.scrsItmsKcdNm;
    Stitle.innerHTML = '<h2 class="Sinfo">'+Sname+'</h2>'

    // sname.innerHTML = sname;

    if (item === undefined)
    {
        OutPutString('<b>주식배당정보 데이터가 없습니다.</b>', false, 'result0');
        OutPutString('<b>주식발행정보 데이터가 없습니다.</b>', false, 'result1');
        OutPutString('<b>주식시세정보 데이터가 없습니다.</b>', false, 'result2');
    }
    else
    {
        // OutPutString(
        //     '<b class="stock-info">주식정보</b>' + '' +
        //     '<li>법인등록번호' + '<span>' + item.crno +'</spn>' +'</li>' +
        //     '<li>주식발행회사명' + '<span>' + item.stckIssuCmpyNm +'</span>' + '</li>' +
        //     '<li>국제증권식별번호코드' + '<span>' + item.isinCd +'</span>' + '</li>' +
        //     '<li>국제증권식별번호코드명' + '<span>' + item.isinCdNm +'</span>' + '</li>' +
        //     '<li>유가증권종목종류코드' +  '<span>' +item.scrsItmsKcd +'</span>' + '</li>' +
        //     '<li>유가증권종목종류코드명' + '<span>' + item.scrsItmsKcdNm +'</span>' + '</li></ui>' +

        OutPutString('<b class="stock-info">주식배당정보</b>' + '' +
        '<li>기준일자' + '<span>' + ParseDate(item.basDt) +'</span>' + '</li>' +
        '<li>배당기준일자' + '<span>' + ParseDate(item.dvdnBasDt) +'</span>'+ '</li>' +
        '<li>현금배당지급일자' + '<span>' + ParseDate(item.cashDvdnPayDt)  +'</span>'+ '</li>' +
        '<li>주식교부일자' + '<span>' + ParseDate(item.stckHndvDt)  +'</span>'+ '</li>' +
        '<li>주식배당사유코드' + '<span>' + item.stckDvdnRcd  +'</span>'+ '</li>' +
        '<li>주식배당사유코드명' + '<span>' + item.stckDvdnRcdNm  +'</span>'+ '</li>' +
        '<li>명의개서대리인구분코드' + '<span>' + item.trsnmDptyDcd  +'</span>'+ '</li>' +
        '<li>명의개서대리인구분코드명' + '<span>' + item.trsnmDptyDcdNm  +'</span>'+ '</li>' +
        '<li>주식일반배당금액' + '<span>' +  new Intl.NumberFormat().format(item.stckGenrDvdnAmt) + '원</span></li>' +
        '<li>주식차등배당금액'  + '<span>' + new Intl.NumberFormat().format(item.stckGrdnDvdnAmt) + '원</span></li>' +
        '<li>주식일반현금배당률'  + '<span>' + item.stckGenrCashDvdnRt  +'</span>'+ '</li>' +
        '<li>주식일반배당률'  + '<span>' + item.stckGenrDvdnRt +'</span>'+ '</li>' +
        '<li>현금차등배당률'  + '<span>' + item.cashGrdnDvdnRt +'</span>'+ '</li>' +
        '<li>주식차등배당률'  + '<span>' + item.stckGrdnDvdnRt +'</span>'+ '</li>' +
        '<li>주식결산월일'  + '<span>' + item.stckStacMd+ '<span></li><ul>'
        , false, 'result0');

        // 금융위원회_주식발행정보
        LoadData("http://apis.data.go.kr/1160100/service/GetStocIssuInfoService/getItemBasiInfo?pageNo=1&numOfRows=1&resultType=json&crno=" + item.crno + "&isinCd=" + item.isinCd + "&serviceKey=" + serviceKeyStr, 1);

        // 금융위원회_주식시세정보
        LoadData("http://api.odcloud.kr/api/GetStockSecuritiesInfoService/v1/getStockPriceInfo?resultType=json&isinCd=" + item.isinCd + "&serviceKey=" + serviceKeyStr, 2);
    }
}

function ParseJSON1(data) {
    item = data.response.body.items.item[0];
    if (item === undefined)
        OutPutString('<b>주식발행정보 데이터가 없습니다.</b>', false, 'result1');
    else
        OutPutString('<b class="stock-info">주식발행정보</b>'  +
        '<li>기준일자'+ '<span>' + ParseDate(item.basDt) + '</span></li>' +
        '<li>발행주식수'+ '<span>' + new Intl.NumberFormat().format(item.issuStckCnt) + '주</span></li>' +
        '<li>상장일자' + '<span>' + ParseDate(item.lstgDt) + '</span></li>' +
        '<li>상장폐지일자'+ '<span>' + ParseDate(item.lstgAbolDt) + '</span></li>' +
        '<li>예탁등록일자'+ '<span>' + ParseDate(item.dpsgRegDt) + '</span></li>' +
        '<li>예탁취소일자'+ '<span>' + ParseDate(item.dpsgCanDt) + '</span></li>' +
        '<li>발행형태구분명'+ '<span>' + item.issuFrmtClsfNm +'</span>'
        , false, 'result1');
}

function ParseJSON2(data, id) {
    item = data.response.body.items.item[id];
    if (item === undefined)
        OutPutString('<b>주식시세정보 데이터가 없습니다.</b>', false, 'result2');
    else
    {
        OutPutString('<b class="stock-info">주식시세정보</b>' +
        '<li>기준일자' + '<span>' + ParseDate(item.basDt) + '</span></li>' +
        '<li>종목코드' + '<span>' + item.srtnCd + '</span></li>' +
        '<li>표준코드' + '<span>' + item.isinCd + '</span></li>' +
        '<li>종목이름' + '<span>' + item.itmsNm + '</span></li>' +
        '<li>시장구분' + '<span>' + item.mrktCtg + '</span></li>' +
        '<li>상장주식수'+ '<span>' + new Intl.NumberFormat().format(item.lstgStCnt) + '주</span></span></li>' +
        '<li>시가총액'+ '<span>' + new Intl.NumberFormat().format(item.mrktTotAmt) + '원</span></li>' +
        '<li>종가' + '<span>' + new Intl.NumberFormat().format(item.clpr) + '원</span></li>' +
        '<li>전일비' + '<span>' + new Intl.NumberFormat().format(item.vs) + '원</span></li>' +
        '<li>등락률'+ '<span>' + item.fltRt + '%</span></li>' +
        '<li>시가' + '<span>' +new Intl.NumberFormat().format(item.mkp) + '원</span></li>' +
        '<li>고가' + '<span>' + new Intl.NumberFormat().format(item.hipr) + '원</span></li>' +
        '<li>저가' + '<span>' + new Intl.NumberFormat().format(item.lopr) + '원</span></li>' +
        '<li>거래량' + '<span>' + new Intl.NumberFormat().format(item.trqu) + '주</span></li>' +
        '<li>거래대금' + '<span>' + new Intl.NumberFormat().format(item.trPrc) + '원</span></li>' +
        '<button class="button" onclick="PrevData();">이전 날짜</button> <button class="button" onclick="NextData();">다음 날짜</button>'
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

