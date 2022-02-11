let locations = new Array();
locations = ["none", "86.6%", "76.5%", "66.2%", "56.1%", "45.5%", "35.4%", "25.2%", "14.9%"]
let lift1;
let lift2;
let lift3;
let token = 0;
let lifts_info=new Map();
let lifts_location=new Array();
lifts_location=[
    {Direction: "none", Location: 1},
    {Direction: "none", Location: 1},
    {Direction: "none", Location: 1}
];
const FloorRequest = function (direction, location) {
    if (config_option === 1) {
        if (token % 3 === 0) {
            lift1.postMessage({Tag: "floor_request", Direction: direction, Location: location});
        } else if (token % 3 === 1) {
            lift2.postMessage({Tag: "floor_request", Direction: direction, Location: location});
        } else {
            lift3.postMessage({Tag: "floor_request", Direction: direction, Location: location});
        }
        token++;
    } else if (config_option === 2) {
        let Candidate = new Array();
        for (let i = 0; i < 3; ++i) {
            if (lifts_location[i].Direction === "Up" && direction === "Up") {
                if (location >= lifts_location[i].Location) {
                    Candidate[i] = location - lifts_location[i].Location;
                } else {
                    Candidate[i] = 16 - location - lifts_location[i].Location;
                }
            } else if (lifts_location[i].Direction === "Down" && direction === "Down") {
                if (location <= lifts_location[i].Location) {
                    Candidate[i] = lifts_location[i].Location - location;
                } else {
                    Candidate[i] = location + lifts_location[i].Location;
                }
            } else if (lifts_location[i].Direction === "Up" && direction === "Down") {
                Candidate[i] = 16 - lifts_location[i].Location - location;
            } else if (lifts_location[i].Direction === "Down" && direction === "Up") {
                Candidate[i] = lifts_location[i].Location + location;
            } else {

                if (location <= lifts_location[i].Location) {
                    Candidate[i] = lifts_location[i].Location - location;
                } else {
                    Candidate[i] = location - lifts_location[i].Location;
                }
            }

        }
        let min = 100;
        let index = 0;
        for (let i = 0; i < 3; ++i) {
            if (Candidate[i] <= min) {
                index = i;
                min = Candidate[i];
            }
        }
        if (index === 0) {
            lift1.postMessage({Tag: "floor_request", Direction: direction, Location: location});
        } else if (index === 1) {
            lift2.postMessage({Tag: "floor_request", Direction: direction, Location: location});
        } else {
            lift3.postMessage({Tag: "floor_request", Direction: direction, Location: location});
        }
    }
};


/*
   处理电梯请求
 */
const LiftRequest = function (name, location) {
    if (name === "lift1") {
        lift1.postMessage({Tag: "lift_request", Location: location});
    } else if (name === "lift2") {
        lift2.postMessage({Tag: "lift_request", Location: location});
    } else if (name === "lift3") {
        lift3.postMessage({Tag: "lift_request", Location: location});
    }
};


$(document).ready(
    function () {

        /*生成并且初始化单体Agent
        每个单梯Agent都是类Lift的实例化，在后台独占一个线程
         */
        lift1 = new Worker("js/LiftAgent.js", {name: "lift1"});
        lift2 = new Worker("js/LiftAgent.js", {name: "lift2"});
        lift3 = new Worker("js/LiftAgent.js", {name: "lift3"});

        /*信息检测
        重写onmessage方法，检测来自单体Agent线程的信息，并且将信息同步到blackboard
         */
        lift1.onmessage = function (e) {
            const message = e.data;
            let action = document.getElementById("lift1_action");
            let up_set=document.getElementById("lift1_Up");
            let down_set=document.getElementById("lift1_Down");
            let status=document.getElementById("lift1_status");
            let direction=document.getElementById("lift1_direction");
            console.log(message);
            if (message.Action === "move") {
                action.value += "Move to " + message.Location + " floor\n";
                direction.value=message.Direction;
                lifts_location[0] = {Direction: message.Direction, Location: message.Location};
                if (message.Direction === "Up"||message.Direction==="Down") {
                    $("#lift1").animate({top: locations[message.Location]}, 2000, function () {
                        document.getElementById("lb_1" + message.Location.toString()).style.background = lb_color_off;
                        ChangeTheFb(message.Location, message.Direction, message.Flag);
                    });
                    $("#door1").animate({top: locations[message.Location]}, 2000);
                }  else if (message.Direction === "none") {
                    setTimeout(function ()
                    {document.getElementById("lb_1" + message.Location.toString()).style.background = lb_color_off;},500)
                    setTimeout(function () {
                        ChangeTheFb(message.Location, message.Direction, message.Flag)
                    }, 500);
                }
            } else if (message.Action === "open") {
                action.value += "Open the door\n";
                direction.value=message.Direction;
                $("#door1").animate({width: "1.4%", left: "45.75%"}, 900);
            } else if (message.Action === "close") {
                action.value += "Close the door\n";
                direction.value=message.Direction;
                $("#door1").animate({width: "0", left: "46.43%"}, 900);
            }else if(message.Action==="changing set")
            {
                up_set.value=StringForSet(message.UpSet);
                down_set.value=StringForSet(message.DownSet);
            }else if(message.Action==="status")
            {
                status.value=message.Status;
            }
        }
        lift2.onmessage = function (e) {
            let message = e.data;
            let action = document.getElementById("lift2_action");
            let status=document.getElementById("lift2_status");
            let direction=document.getElementById("lift2_direction");
            let up_set=document.getElementById("lift2_Up");
            let down_set=document.getElementById("lift2_Down");
            console.log(message);
            if (message.Action === "move") {
                action.value += "Move to " + message.Location + " floor\n";
                direction.value=message.Direction;
                lifts_location[1] = {Direction: message.Direction, Location: message.Location};
                if (message.Direction === "Up"||message.Direction==="Down") {
                    $("#lift2").animate({top: locations[message.Location]}, 2000, function () {
                        document.getElementById("lb_2" + message.Location.toString()).style.background = lb_color_off;
                        ChangeTheFb(message.Location, message.Direction, message.Flag);
                    });
                    $("#door2").animate({top: locations[message.Location]}, 2000);
                }  else if (message.Direction === "none") {
                    setTimeout(function ()
                    {document.getElementById("lb_2" + message.Location.toString()).style.background = lb_color_off;},500)
                    setTimeout(function () {
                        ChangeTheFb(message.Location, message.Direction, message.Flag)
                    }, 500);
                }
            } else if (message.Action === "open") {
                action.value += "Open the door\n";
                direction.value=message.Direction;
                $("#door2").animate({width: "1.4%", left: "49.45%"}, 900);
            } else if (message.Action === "close") {
                action.value += "Close the door\n";
                direction.value=message.Direction;
                $("#door2").animate({width: "0", left: "50.12%"}, 900);
            }else if(message.Action==="changing set")
            {
                up_set.value=StringForSet(message.UpSet);
                down_set.value=StringForSet(message.DownSet);
            }else if(message.Action==="status")
            {
                status.value=message.Status;
            }
        }
        lift3.onmessage = function (e) {
            let message = e.data;
            let action = document.getElementById("lift3_action");
            let status=document.getElementById("lift3_status");
            let direction=document.getElementById("lift3_direction");
            let up_set=document.getElementById("lift3_Up");
            let down_set=document.getElementById("lift3_Down");
            console.log(message);
            if (message.Action === "move") {
                action.value += "Move to " + message.Location + " floor\n";
                direction.value=message.Direction;
                lifts_location[2] = {Direction: message.Direction, Location: message.Location};
                if (message.Direction === "Up"||message.Direction==="Down") {
                    $("#lift3").animate({top: locations[message.Location]}, 2000, function () {
                        document.getElementById("lb_3" + message.Location.toString()).style.background = lb_color_off;
                        ChangeTheFb(message.Location, message.Direction, message.Flag);
                    });
                    $("#door3").animate({top: locations[message.Location]}, 2000);
                } else if (message.Direction === "none") {
                    setTimeout(function ()
                    {document.getElementById("lb_3" + message.Location.toString()).style.background = lb_color_off;},500)
                    setTimeout(function () {
                        ChangeTheFb(message.Location, message.Direction, message.Flag)
                    }, 500);
                }
            } else if (message.Action === "open") {
                action.value += "Open the door\n";
                direction.value=message.Direction;
                $("#door3").animate({width: "1.4%", left: "53.21%"}, 900);

            } else if (message.Action === "close") {
                action.value += "Close the door\n";
                direction.value=message.Direction;
                $("#door3").animate({width: "0", left: "53.85%"}, 900);
            }else if(message.Action==="changing set")
            {
                up_set.value=StringForSet(message.UpSet);
                down_set.value=StringForSet(message.DownSet);
            }else if(message.Action==="status")
            {
                status.value=message.Status;
            }
        }
    }
);
let ChangeTheFb = function (location, direction, flag) {
    let fb_down = document.getElementById("fb_" + location.toString() + "down");
    let fb_up = document.getElementById("fb_" + location.toString() + "up");
    if (flag === "normal") {
        if (fb_down && direction === "Down") {
            fb_down.src = "src/button_down.jpg";
        } else if (fb_up && direction === "Up") {
            fb_up.src = "src/button_up.jpg"
        }
    } else if (flag === "special") {
        if (fb_down) {
            fb_down.src = "src/button_down.jpg";
        }
        if (fb_up) {
            fb_up.src = "src/button_up.jpg"
        }
    }

}
let StringForSet=function (set)
{
    let str="";
    for(let x of set)
    {
      str+=x.toString()+" ";
    }
    return str;
}