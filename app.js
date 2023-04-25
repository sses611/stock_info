var req_url = 'http://apis.data.go.kr/1160100/service/GetStocDiviInfoService/getDiviInfo'
var serviceKeyStr = "yVuS2h%2Fn6vH7khxL68QEYxgERpm6yXqauRIDptTSGqAlehwhW5E4PQ9CJO4y%2FoxGujJHRXd3H8D%2BOuv5Vfhldw%3D%3D"



function GetStoreList() {
    LoadData(req_url+"?pageNo=1&numOfRows=1&resultType=json&stckIssuCmpyNm=" +
    encodeURI(document.getElementById('cname').value) + "&scrsItmsKcdNm=" + 
    encodeURI(document.getElementById('ctype').value) + "&serviceKey=" + serviceKeyStr, 0);
} 

function LoadData(url, mode){
    $.ajax({
        crossOrigin: true,
        proxy: "proxy.php",
        dataType: "json",
        url: url,
        success: function(data) {
            try {
            }catch{

            }
        }
    })
}
