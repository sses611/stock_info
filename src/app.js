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
        OutPutString(
        '<ul><b class="stock-info">주식정보</b>' + '' +
        '<li>법인등록번호' + '<span' +item.crno +'</spn>'+'</li>' +
        '<li>주식발행회사명' + item.stckIssuCmpyNm + '</li>' +
        '<li>국제증권식별번호코드' + item.isinCd + '</li>' +
        '<li>국제증권식별번호코드명' + item.isinCdNm + '</li>' +
        '<li>유가증권종목종류코드' + item.scrsItmsKcd + '</li>' +
        '<li>유가증권종목종류코드명' + item.scrsItmsKcdNm + '</li></ui>' +
        '<ul><b class="stock-info">주식배당정보</b>' + '' +
        '<li>기준일자' + ParseDate(item.basDt) + '</li>' +
        '<li>배당기준일자' + ParseDate(item.dvdnBasDt) + '</li>' +
        '<li>현금배당지급일자' + ParseDate(item.cashDvdnPayDt) + '</li>' +
        '<li>주식교부일자' + ParseDate(item.stckHndvDt) + '</li>' +
        '<li>주식배당사유코드' + item.stckDvdnRcd + '</li>' +
        '<li>주식배당사유코드명' + item.stckDvdnRcdNm + '</li>' +
        '<li>명의개서대리인구분코드' + item.trsnmDptyDcd + '</li>' +
        '<li>명의개서대리인구분코드명' + item.trsnmDptyDcdNm + '</li>' +
        '<li>주식일반배당금액' + new Intl.NumberFormat().format(item.stckGenrDvdnAmt) + '원</li>' +
        '<li>주식차등배당금액' + new Intl.NumberFormat().format(item.stckGrdnDvdnAmt) + '원</li>' +
        '<li>주식일반현금배당률' + item.stckGenrCashDvdnRt + '</li>' +
        '<li>주식일반배당률' + item.stckGenrDvdnRt + '</li>' +
        '<li>현금차등배당률' + item.cashGrdnDvdnRt + '</li>' +
        '<li>주식차등배당률' + item.stckGrdnDvdnRt + '</li>' +
        '<li>주식결산월일' + item.stckStacMd+ '</li></ul>'
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
        OutPutString('<b class="stock-info">주식발행정보</b>' + '' +
        '기준일자　　　: ' + ParseDate(item.basDt) + '' +
        '발행주식수　　: ' + new Intl.NumberFormat().format(item.issuStckCnt) + '주' +
        '상장일자　　　: ' + ParseDate(item.lstgDt) + '' +
        '상장폐지일자　: ' + ParseDate(item.lstgAbolDt) + '' +
        '예탁등록일자　: ' + ParseDate(item.dpsgRegDt) + '' +
        '예탁취소일자　: ' + ParseDate(item.dpsgCanDt) + '' +
        '발행형태구분명: ' + item.issuFrmtClsfNm
        , false, 'result1');
}

function ParseJSON2(data, id) {
    item = data.response.body.items.item[id];
    if (item === undefined)
        OutPutString('<b>주식시세정보 데이터가 없습니다.</b>', false, 'result2');
    else
    {
        OutPutString('<b class="stock-info">주식시세정보</b>' + '' +
        '기준일자　: ' + ParseDate(item.basDt) + '' +
        '종목코드　: ' + item.srtnCd + '' +
        '표준코드　: ' + item.isinCd + '' +
        '종목이름　: ' + item.itmsNm + '' +
        '시장구분　: ' + item.mrktCtg + '' +
        '상장주식수: ' + new Intl.NumberFormat().format(item.lstgStCnt) + '주' +
        '시가총액　: ' + new Intl.NumberFormat().format(item.mrktTotAmt) + '원' +
        '종가　　　: ' + new Intl.NumberFormat().format(item.clpr) + '원' +
        '전일비　　: ' + new Intl.NumberFormat().format(item.vs) + '원' +
        '등락률　　: ' + item.fltRt + '%' +
        '시가　　　: ' + new Intl.NumberFormat().format(item.mkp) + '원' +
        '고가　　　: ' + new Intl.NumberFormat().format(item.hipr) + '원' +
        '저가　　　: ' + new Intl.NumberFormat().format(item.lopr) + '원' +
        '거래량　　: ' + new Intl.NumberFormat().format(item.trqu) + '주' +
        '거래대금　: ' + new Intl.NumberFormat().format(item.trPrc) + '원' +
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

