var today="Tuesday";
var totalTime=3000;
var currentTime=1800;
var hours=0;
var minutes=30;
var seconds=0;
var monday=[];
var tuesday=[];
var wednesday=[];
var thursday=[];
var friday=[];
var schedule=[];
var currentItem="No Classes Today";
var color1="#1574e8";
var color2="#26b8dd";
if(window.screen.width==1280){
    document.body.style.zoom = "75%";
}
class Item{
    constructor(name,starthour,startminute,endhour,endminute){
        this.name=name;
        this.starthour=starthour;
        this.startminute=startminute;
        this.endhour=endhour;
        this.endminute=endminute;
    }
}

function gTime(item){
    return timeString(item.starthour,item.startminute)+" - "+timeString(item.endhour,item.endminute);
}

function timeString(hour,minute){
    return (hour>9?""+hour:"0"+hour) +":"+ (minute>9?""+minute:"0"+minute);
}

function timer(){
    var lastOne=false;
    currentTime--;
    document.getElementById("bar").style.width=87.2*(currentTime/totalTime)+"%";
    if(seconds>0){
        seconds--;
    }else{
        seconds=59;
        if(minutes>0){
            minutes--;
        }else{
            minutes=59;
            if(hours>0){
                hours--;
            }else{
                updateCurrent();
                renderSchedule();
                lastOne=true;
            }
        }
    }
    var string=(hours>9?""+hours:"0"+hours) +":"+ (minutes>9?""+minutes:"0"+minutes) +":"+ (seconds>9?""+seconds:"0"+seconds);
    document.getElementById("timer").innerHTML=string;
    if(lastOne){
        timer();
    }
    else{
        setTimeout(() => {
            timer();
        },1000);
    } 
}

function loadData(){
    monday=JSON.parse(localStorage.getItem("monday"));
    if(monday==null) monday=[];
    tuesday=JSON.parse(localStorage.getItem("tuesday"));
    if(tuesday==null) tuesday=[];
    wednesday=JSON.parse(localStorage.getItem("wednesday"));
    if(wednesday==null) wednesday=[];
    thursday=JSON.parse(localStorage.getItem("thursday"));
    if(thursday==null) thursday=[];
    friday=JSON.parse(localStorage.getItem("friday"));
    if(friday==null) friday=[];
    color1=localStorage.getItem("color1");
    color2=localStorage.getItem("color2");
    document.body.style.setProperty("--color1",color1);
    document.body.style.setProperty("--color2",color2);
}

function updateCurrent(){
    var date=new Date();
    var day=date.getDay();
	if(day==0) today="Sunday";
	else if(day==1) today="Monday";
	else if(day==2) today="Tuesday";
	else if(day==3) today="Wednesday";
	else if(day==4) today="Thursday";
	else if(day==5) today="Friday";
	else if(day==6) today="Saturday";
    document.getElementById("schedulelabel").innerHTML=today;
    if(today=="Monday"){
        schedule=monday;
    }else if(today=="Tuesday"){
        schedule=tuesday;
    }else if(today=="Wednesday"){
        schedule=wednesday;
    }else if(today=="Thursday"){
        schedule=thursday;
    }else if(today=="Friday"){
        schedule=friday;
    }
    var currentHour=date.getHours();
    var currentMinute=date.getMinutes();
    for(var i=0;i<schedule.length;i++){
        var item=schedule[i];
        if(currentHour>=item.starthour && currentHour<=item.endhour){
            var goodTime=false;
            if(item.starthour==item.endhour){
                if(currentMinute>=item.startminute && currentMinute<item.endminute){
                    goodTime=true;
                }
            }else{
                if(
                    (currentHour>item.starthour && currentHour<item.endhour) || 
                    (currentHour==item.starthour && currentMinute>=item.startminute) ||
                    (currentHour==item.endhour && currentMinute<item.endminute)
                ){
                    goodTime=true;
                }
            }
            
            if(goodTime){
                currentItem=item.name;
                totalTime=(item.endhour*3600+item.endminute*60)-(item.starthour*3600+item.startminute*60);
                var currentSecond=date.getSeconds();
                currentTime=(item.endhour*3600+item.endminute*60)-(currentHour*3600+currentMinute*60+currentSecond);
                hours=parseInt(currentTime/3600);
                minutes=parseInt((currentTime%3600)/60);
                seconds=(currentTime%60);
                break;
            }
        }
    }
    document.getElementById("class").innerHTML=currentItem;
}

function renderSchedule(){
    var old=document.getElementsByClassName("scheduleitem");;
    var l=old.length;
    for(var i=0;i<l;i++){
        old[0].remove();
    }
    var counter=0;
    for(var i=0;i<schedule.length;i++){
        var item=schedule[i];
        if(item.name!="Break"){
            var sitem=document.createElement("div");
            sitem.classList.add("scheduleitem");
            sitem.style.top=(27+counter*15)+"%";
            var itemname=document.createElement("div");
            itemname.classList.add("itemname");
            itemname.innerHTML=item.name;
            if(item.name===currentItem){
                sitem.style.background="-webkit-linear-gradient(var(--color1), var(--color2))";
                sitem.style.color="white";
            }
            var itemtime=document.createElement("div");
            itemtime.classList.add("itemtime");
            itemtime.innerHTML=gTime(item);
            sitem.appendChild(itemname);
            sitem.appendChild(itemtime);
            document.getElementById("schedule").appendChild(sitem);
            counter++;
        }
    }
    
}

function saveSchedule(day){
    var classes=document.getElementById(day).getElementsByClassName("dayitem");
    if(!(classes.length>0)) return;
    var temp=[];
    for(var i=0;i<classes.length;i++){
        var clas=classes[i];
        var name=clas.getElementsByClassName("dayitemname")[0].value;
        if(name!=""){
            var starttime=clas.getElementsByClassName("dayitemstarttime")[0].value;
            var endtime=clas.getElementsByClassName("dayitemendtime")[0].value;
            var starthour=parseInt(starttime.split(":")[0]);
            var startminute=parseInt(starttime.split(":")[1]);
            var endhour=parseInt(endtime.split(":")[0]);
            var endminute=parseInt(endtime.split(":")[1]);
            temp.push(new Item(name,starthour,startminute,endhour,endminute));
        }
        
    }
    if(!(temp.length>0)){
        if(day=="monday"){
            monday=[];
        }else if(day=="tuesday"){
            tuesday=[];
        }else if(day=="wednesday"){
            wednesday=[];
        }else if(day=="thursday"){
            thursday=[];
        }else if(day=="friday"){
            friday=[];
        }
        return;
    }
    temp.sort(compare);
    temp.splice(0,0,new Item("Break",0,0,temp[0].starthour,temp[0].startminute));
    var l=temp.length;
    var counter=1;
    for(var i=1;i<l;i++){
        if(i==l-1){
            var thing=temp[counter];
            temp.splice(counter+1,0,new Item("Break",thing.endhour,thing.endminute,24,0));
        }else{
            var thing=temp[counter];
            var nextthing=temp[counter+1];
            temp.splice(counter+1,0,new Item("Break",thing.endhour,thing.endminute,nextthing.starthour,nextthing.startminute));
            counter+=2;
        }
    }
    if(day=="monday"){
        monday=temp;
        localStorage.setItem("monday",JSON.stringify(monday));
    }else if(day=="tuesday"){
        tuesday=temp;
        localStorage.setItem("tuesday",JSON.stringify(tuesday));
    }else if(day=="wednesday"){
        wednesday=temp;
        localStorage.setItem("wednesday",JSON.stringify(wednesday));
    }else if(day=="thursday"){
        thursday=temp;
        localStorage.setItem("thursday",JSON.stringify(thursday));
    }else if(day=="friday"){
        friday=temp;
        localStorage.setItem("friday",JSON.stringify(friday));
    }
    
}

function compare(a,b){
    return a.starthour-b.starthour;
}

function loadSchedule(day){
    var theArray;
    if(day=="monday"){
        theArray=monday;
    }else if(day=="tuesday"){
        theArray=tuesday;
    }else if(day=="wednesday"){
        theArray=wednesday;
    }else if(day=="thursday"){
        theArray=thursday;
    }else if(day=="friday"){
        theArray=friday;
    }
    var counter=0;
    for(var i=0;i<theArray.length;i++){
        if(theArray[i].name!="Break"){
            var a=h("div","dayitem");
            a.style.top=(15+counter*10)+"%";
            var b=h("input","dayitemname");
            b.value=theArray[i].name;
            var c=h("input","dayitemstarttime");
            c.value=timeString(theArray[i].starthour,theArray[i].startminute);
            var d=h("input","dayitemendtime");
            d.value=timeString(theArray[i].endhour,theArray[i].endminute);
            a.appendChild(b);
            a.appendChild(c);
            a.appendChild(d);
            document.getElementById(day).appendChild(a);
            counter++;
        }
    }
    document.getElementById(day+"newitem").style.top=(5+counter*10+10)+"%";
}

function newItem(day){
    var theArray;
    if(day=="monday"){
        theArray=monday;
    }else if(day=="tuesday"){
        theArray=tuesday;
    }else if(day=="wednesday"){
        theArray=wednesday;
    }else if(day=="thursday"){
        theArray=thursday;
    }else if(day=="friday"){
        theArray=friday;
    }
    var a=h("div","dayitem");
    a.style.top=(15+parseInt(theArray.length/2)*10)+"%";
    var b=h("input","dayitemname");
    var c=h("input","dayitemstarttime");
    var d=h("input","dayitemendtime");
    b.placeholder="Class Name";
    c.placeholder="Start";
    d.placeholder="End";
    a.appendChild(b);
    a.appendChild(c);
    a.appendChild(d);
    document.getElementById(day).appendChild(a);
    document.getElementById(day+"newitem").style.top=(15+parseInt(theArray.length/2)*10+10)+"%";
    theArray.push(0);
}

function h(t,c){
    var d=document.createElement(t);
    d.classList.add(c);
    return d;
}

function openSettings(){
    var old=document.getElementsByClassName("dayitem");
    var l=old.length;
    for(var i=0;i<l;i++){
        old[0].remove();
    }
    loadSchedule("monday");
    loadSchedule("tuesday");
    loadSchedule("wednesday");
    loadSchedule("thursday");
    loadSchedule("friday");
    document.getElementById("color1").value=color1;
    document.getElementById("color2").value=color2;
    
    document.getElementById("app").style.display="none";
    document.getElementById("settings").style.display="block";
}

function closeSettings(){
    saveSchedule("monday");
    saveSchedule("tuesday");
    saveSchedule("wednesday");
    saveSchedule("thursday");
    saveSchedule("friday");
    updateCurrent();
    renderSchedule();
    
    color1=document.getElementById("color1").value;
    color2=document.getElementById("color2").value;
    document.body.style.setProperty("--color1",color1);
    document.body.style.setProperty("--color2",color2);
    localStorage.setItem("color1",color1);
    localStorage.setItem("color2",color2);

    document.getElementById("app").style.display="block";
    document.getElementById("settings").style.display="none";
}

loadData();
updateCurrent();
renderSchedule();
timer();

document.addEventListener("visibilitychange", (event) => {
    if (document.visibilityState == "visible") {
        updateCurrent();
        renderSchedule();
    }
});