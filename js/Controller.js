let config_option = 1;
let lb_color_on = "#fffbe4";
let lb_color_off = "#eaeaea";
let isHid=false;
$(document).ready(
    function ()
    {
        /*
             绑定楼层按钮的点击事件
        */
        {
            $("#fb_1up").click(function () {
                FloorRequest("Up", 1);
                this.src = "src/new_button_up.png"
            });
            $("#fb_2down").click(function () {
                FloorRequest("Down", 2);
                this.src = "src/new_button_down.png"
            });
            $("#fb_2up").click(function () {
                FloorRequest("Up", 2);
                this.src = "src/new_button_up.png"
            });
            $("#fb_3down").click(function () {
                FloorRequest("Down", 3);
                this.src = "src/new_button_down.png"
            });
            $("#fb_3up").click(function () {
                FloorRequest("Up", 3);
                this.src = "src/new_button_up.png"
            });
            $("#fb_4down").click(function () {
                FloorRequest("Down", 4);
                this.src = "src/new_button_down.png"
            });
            $("#fb_4up").click(function () {
                FloorRequest("Up", 4);
                this.src = "src/new_button_up.png"
            });
            $("#fb_5down").click(function () {
                FloorRequest("Down", 5);
                this.src = "src/new_button_down.png"
            });
            $("#fb_5up").click(function () {
                FloorRequest("Up", 5);
                this.src = "src/new_button_up.png"
            });
            $("#fb_6down").click(function () {
                FloorRequest("Down", 6);
                this.src = "src/new_button_down.png"
            });
            $("#fb_6up").click(function () {
                FloorRequest("Up", 6);
                this.src = "src/new_button_up.png"
            });
            $("#fb_7down").click(function () {
                FloorRequest("Down", 7);
                this.src = "src/new_button_down.png"
            });
            $("#fb_7up").click(function () {
                FloorRequest("Up", 7);
                this.src = "src/new_button_up.png"
            });
            $("#fb_8down").click(function () {
                FloorRequest("Down", 8);
                this.src = "src/new_button_down.png"
            });
        }


        /*
             绑定电梯按钮的点击事件
         */
        {
            $("#lb_11").click(function () {
                LiftRequest("lift1", 1);
                this.style.background = lb_color_on
            });
            $("#lb_12").click(function () {
                LiftRequest("lift1", 2);
                this.style.background = lb_color_on
            });
            $("#lb_13").click(function () {
                LiftRequest("lift1", 3);
                this.style.background = lb_color_on
            });
            $("#lb_14").click(function () {
                LiftRequest("lift1", 4);
                this.style.background = lb_color_on
            });
            $("#lb_15").click(function () {
                LiftRequest("lift1", 5);
                this.style.background = lb_color_on
            });
            $("#lb_16").click(function () {
                LiftRequest("lift1", 6);
                this.style.background = lb_color_on
            });
            $("#lb_17").click(function () {
                LiftRequest("lift1", 7);
                this.style.background = lb_color_on
            });
            $("#lb_18").click(function () {
                LiftRequest("lift1", 8);
                this.style.background = lb_color_on
            });

            $("#lb_21").click(function () {
                LiftRequest("lift2", 1);
                this.style.background = lb_color_on
            });
            $("#lb_22").click(function () {
                LiftRequest("lift2", 2);
                this.style.background = lb_color_on
            });
            $("#lb_23").click(function () {
                LiftRequest("lift2", 3);
                this.style.background = lb_color_on
            });
            $("#lb_24").click(function () {
                LiftRequest("lift2", 4);
                this.style.background = lb_color_on
            });
            $("#lb_25").click(function () {
                LiftRequest("lift2", 5);
                this.style.background = lb_color_on
            });
            $("#lb_26").click(function () {
                LiftRequest("lift2", 6);
                this.style.background = lb_color_on
            });
            $("#lb_27").click(function () {
                LiftRequest("lift2", 7);
                this.style.background = lb_color_on
            });
            $("#lb_28").click(function () {
                LiftRequest("lift2", 8);
                this.style.background = lb_color_on
            });

            $("#lb_31").click(function () {
                LiftRequest("lift3", 1);
                this.style.background = lb_color_on
            });
            $("#lb_32").click(function () {
                LiftRequest("lift3", 2);
                this.style.background = lb_color_on
            });
            $("#lb_33").click(function () {
                LiftRequest("lift3", 3);
                this.style.background = lb_color_on
            });
            $("#lb_34").click(function () {
                LiftRequest("lift3", 4);
                this.style.background = lb_color_on
            });
            $("#lb_35").click(function () {
                LiftRequest("lift3", 5);
                this.style.background = lb_color_on
            });
            $("#lb_36").click(function () {
                LiftRequest("lift3", 6);
                this.style.background = lb_color_on
            });
            $("#lb_37").click(function () {
                LiftRequest("lift3", 7);
                this.style.background = lb_color_on
            });
            $("#lb_38").click(function () {
                LiftRequest("lift3", 8);
                this.style.background = lb_color_on
            });
        }

        /*
        配置面板的事件绑定
         */
        $('input[type=radio][name="config"]').change(function () {
            if (this.value === 'default') {
                config_option = 1;
            } else if (this.value === 'smart') {
                config_option = 2;
            }
        });
        $("#status").click(function (){
            if(!isHid) {
                $("#over_status").animate({width: "99.3%",left:"0"},1000)
                isHid=true;
            }
            else {
                $("#over_status").animate({width: "0",left: "50%"},1000)
                isHid=false ;
            }
        })
    }
)