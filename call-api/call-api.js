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
    var tableCookies = document.getElementById('table-cookies');
    let html = ``;
    var count = 1;
    res.forEach(element => {
        var checked = element['status'] ? 'checked=""' : "";
        let htmlSegment = 
        ` <tr scope="row" >
            <td>${count++}</td>
            <td class="pl-0">
            <div class="d-flex align-items-center">
                <a href="#" class="name">${element['uid']}</a>
            </div>
            </td>
            <td>${element['browser']}</td>
            <td>
                <div class="form-group purple-border">
                    <textarea class="form-control" id="exampleFormControlTextarea4" rows="3">${element['cookie']}</textarea>
                </div>
            </td>
            <td>${element['createdDate'].slice(0, 19).replace(/-/g, "/").replace("T", " ")}</td>
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
        
    });
    tableCookies.innerHTML = html;

    for(var i=1;i<=count;i++){
        try{
             mappingBtn(i);
        }
        catch(err){

        }
    }
}
function mappingBtn(i){
    document.getElementById(`btn-delete${i}`).onclick =function(){
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
                data: JSON.stringify(data)
            });
            window.location.href = '../home.html';
        }
        else{
            window.location.href = '../index.html';
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
        }
        else{
            window.location.href = '../index.html';
        }
    }
}
async function getListCookie(){
    try {
        const res = await getResp("/get-cookies");
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
            localStorage.clear();
            window.location.href = '../index.html';
       }
}



callGetUserInfo();