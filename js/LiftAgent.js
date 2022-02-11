let Lift = {//封装电梯
    createNew: function (name) {
        let lift = {};
        let Up_Req_Set = new Set();
        let Down_Req_Set = new Set();
        let Current_Req = false;
        const No = name;
        let Status = "Stopping";//Waiting/Upping/Downing/Stopping
        let Location = 1;
        let Direction = "none";//Down/up/none
        let isInitiated = false;
        let isWorked = true;
        let isStopped = false;
        let isOpened = false;
        lift.isInitiated = function () {
            return isInitiated;
        }
        lift.Max = function (set) {
            let max = 0;
            for (let x of set) {
                if (x > max) {
                    max = x;
                }
            }
            return max;
        }
        lift.GetUpReqSet=function ()
        {
            return Up_Req_Set;
        }
        lift.GetDownReqSet=function ()
        {
            return Down_Req_Set;
        }
        lift.isCorrect=function (Location)
        {
            if(Location>=1&&Location<=8&&Math.round(Location)===(Location))
            {
                return true;
            }else {
                return false;
            }
        }
        lift.Min = function (set) {
            let min = 100;
            for (let x of set) {
                if (x < min) {
                    min = x;
                }
            }
            return min;
        }
        lift.AddReq = function (request)//接受请求
        {

            if (request.Tag === "Up") {
                if (request.Location < Location) {
                    Down_Req_Set.add(request.Location)

                } else if (request.Location === Location) {
                    Current_Req = true;
                } else {
                    Up_Req_Set.add(request.Location);
                }
            } else if (request.Tag === "Down") {
                if (request.Location > Location) {
                    Up_Req_Set.add(request.Location)
                } else if (request.Location === Location) {
                    Current_Req = true;
                } else {
                    Down_Req_Set.add(request.Location);
                }
            } else if (request.Tag == "Lift") {
                if (request.Location > Location) {
                    Up_Req_Set.add(request.Location);
                } else if (request.Location < Location) {
                    Down_Req_Set.add(request.Location);
                } else {
                    Current_Req = true;
                }
            }

        }
        lift.RemoveReq = function ()//移除请求
        {
            if (Direction === "Up") {
                Up_Req_Set.delete(Location);
            } else if (Direction === "Down") {
                Down_Req_Set.delete(Location);
            } else {
                Current_Req = false;
            }
        }
        lift.GetStatus = function () {
            return Status;
        }
        lift.ChangeStatus = function (status) {
            const last_status = Status;
            Status = status;
            return last_status;
        }

        lift.GetLocation = function () {
            return Location;
        }
        lift.Initiate = function () {
            if (!isInitiated) {
                console.log(Up_Req_Set);
                Status = "Waiting";
                if (Up_Req_Set.size > 0 || Down_Req_Set.size > 0) {
                    Direction = "Up";
                    isInitiated = true;
                } else if (Current_Req) {
                    Direction = "none";
                    isInitiated = true;
                } else {

                }
            }
        }
        lift.Moving = function () {
            if (lift.Max(Up_Req_Set) > Location && Direction === "Up") {
                if(lift.isCorrect(Location+0.5)) {
                    if (Down_Req_Set.size === 0 || Up_Req_Set.size === 0)
                        postMessage({
                            Tag: self.name,
                            Action: "move",
                            Direction: "Up",
                            Location: Location + 0.5,
                            Flag: "special"
                        });
                    else
                        postMessage({
                            Tag: self.name,
                            Action: "move",
                            Direction: "Up",
                            Location: Location + 0.5,
                            Flag: "normal"
                        });
                }

            } else if (lift.Min(Down_Req_Set) < Location && Direction === "Down") {
                if(lift.isCorrect(Location-0.5)) {
                    if (Down_Req_Set.size === 0 || Up_Req_Set.size === 0)
                        postMessage({
                            Tag: self.name,
                            Action: "move",
                            Direction: "Down",
                            Location: Location - 0.5,
                            Flag: "special"
                        });
                    else
                        postMessage({
                            Tag: self.name,
                            Action: "move",
                            Direction: "Down",
                            Location: Location - 0.5,
                            Flag: "normal"
                        });
                }
            } else if (Current_Req && Direction === "none") {
                if(lift.isCorrect(Location))
                    postMessage(
                        {
                            Tag: self.name,
                            Action: "move",
                            Direction: "none",
                            Location: Location,
                            Status:lift.GetStatus(),
                            Flag: "special"
                        });
                Current_Req = false;
                return true;
            }
        }
        lift.OpenTheDoor = function (factor) {
            if (Direction === "Up") {
                Location += 0.5;
                if (Up_Req_Set.has(Location )) {
                    Up_Req_Set.delete(Location);
                    postMessage({
                        Action:"changing set",
                        UpSet:lift.GetUpReqSet(),
                        DownSet:lift.GetDownReqSet()
                    });

                }
            } else if (Direction === "Down") {
                Location -= 0.5;
                if (Down_Req_Set.has(Location )) {
                    Down_Req_Set.delete(Location);
                    postMessage({
                        Action:"changing set",
                        UpSet:lift.GetUpReqSet(),
                        DownSet:lift.GetDownReqSet()
                    });

                }
            } else {
                Location += 0;
            }
            Status = "Waiting";
            postMessage({
                Action:"status",
                Status:"Waiting"
            })
            console.log("Location" + Location);
            console.log("Direction" + Direction);
            if (factor) {
                isOpened = true;
                postMessage(
                    {
                        Tag: self.name,
                        Action: "open",
                        Direction:"none"
                    });
            } else {
                isWorked = true;
            }
        }
        lift.DisposeReq = function (factor = true)//处理请求
        {
            if (lift.Max(Up_Req_Set) < Location && Direction === "Up" && Down_Req_Set.size > 0) {
                Direction = "Down";
            } else if (lift.Min(Down_Req_Set) > Location && Direction === "Down" && Up_Req_Set.size > 0) {
                Direction = "Up";
            } else if (Direction === "none" && Up_Req_Set.size > 0 && lift.Min(Up_Req_Set) > Location) {
                Direction = "Up";
            } else if (Direction === "none" && Down_Req_Set.size > 0 && lift.Max(Down_Req_Set) < Location) {
                Direction = "Down";
            } else if (Down_Req_Set.size === 0 && Up_Req_Set.size === 0) {
                Direction = "none";
                if(isOpened===true)
                lift.CloseTheDoor(true);
                else
                    lift.CloseTheDoor(false);
            }
            if (factor) {
                isWorked = true;
            }
        }

        lift.CloseTheDoor = function (factor) {

            if (Direction === "Up") {
                Location += 0.5;
                Status = "Upping";
                postMessage({
                    Action:"status",
                    Status:"Upping"
                });
            } else if (Direction === "Down") {
                Location -= 0.5;
                Status = "Downing";
                postMessage({
                    Action:"status",
                    Status:"Downing"
                })
            } else {
                Location += 0;
                Status = "Waiting";
                postMessage({
                    Action:"status",
                    Status:"Waiting"
                })
            }
            if (factor) {
                postMessage({
                    Tag: self.name,
                    Action: "close",
                    Status:lift.GetStatus(),
                    Direction:"none"
                });
                isOpened = false;
            }

        }
        lift.Run = function () {
            lift.DisposeReq(false);
            if (Current_Req || Direction === "none")//请求是当前楼层或者当前楼层恰好停有电梯
            {
                lift.OpenTheDoor(true);//开门动作
                setTimeout(lift.DisposeReq, 1000);//一秒后，处理请求并关门
                lift.Moving();
            } else {//当前楼层没有即时请求，查看下一目标楼层是符合请求队列的请求
                if ((Direction === "Up" && Up_Req_Set.has(Location + 1)) || (Direction === "Down" && Down_Req_Set.has(Location - 1))) {
                    if (isOpened) {
                        lift.CloseTheDoor(true);
                        setTimeout(lift.Moving, 1000);
                        setTimeout(lift.OpenTheDoor, 3000, true);
                        setTimeout(lift.DisposeReq, 4000);//一秒后，处理请求并关门
                    } else {
                        lift.CloseTheDoor(false);
                        lift.Moving();
                        setTimeout(lift.OpenTheDoor, 2000, true);
                        setTimeout(lift.DisposeReq, 3000);//一秒后，处理请求并关门
                    }
                } else {
                    if (isOpened) {
                        lift.CloseTheDoor(true);
                        setTimeout(lift.Moving, 1000, false);
                        setTimeout(lift.OpenTheDoor, 3000, false);
                    } else {
                        lift.CloseTheDoor(false);
                        lift.Moving();
                        setTimeout(lift.OpenTheDoor, 2000, false);
                    }
                }

            }
            //return Location;
        }
        lift.ifWork = function () {
            if (isInitiated) {
                if (!isStopped) {
                    clearInterval(id);
                }
                if (isWorked) {
                    if (Current_Req || Up_Req_Set.size > 0 || Down_Req_Set.size > 0) {
                        isWorked = false;
                        lift.Run();
                    }
                }
            }
        }
        return lift;
    }
}
onmessage = function (e)//在主线程接受消息,电梯接受的消息只有请求//(优化目标）请求来自请求管理器
{
    let message = e.data;
    if (message.Tag === "floor_request") {
        console.log(message);
        lift.AddReq({Tag: message.Direction, Location: message.Location});
        postMessage({
            Action:"changing set",
            UpSet:lift.GetUpReqSet(),
            DownSet:lift.GetDownReqSet()
        });

    } else if (message.Tag == "lift_request") {
        console.log(message);
        lift.AddReq({Tag: "Lift", Location: message.Location});
        postMessage({
            Action:"changing set",
            UpSet:lift.GetUpReqSet(),
            DownSet:lift.GetDownReqSet()
        });
    }
}
let lift = Lift.createNew(self.name);
let id = setInterval(lift.Initiate, 30);
setInterval(lift.ifWork, 30);


