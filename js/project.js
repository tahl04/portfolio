
const slider = document.getElementById('project');
const s_wid = slider.offsetWidth;
const s_li = slider.children;
let win_wid = window.innerWidth;
let s_move_max = (s_wid - (win_wid/2)) * -1;
let s_pos = 0;
let li_pos = 0;
let pct = 0;


slider.addEventListener('wheel',function(e){
    e.preventDefault;
    move_slider(e.deltaY);
    on_indicator();
});

function move_slider(amount){
    s_pos -= amount;
    if(s_pos < s_move_max){
        s_pos = s_move_max;
        return;
    }else if(s_pos > 0){
        s_pos = 0;
        return;
    }
    slider.style.transform = `translateX(${s_pos}px)`;
    li_upDown(amount);
    
}

function li_upDown(amount){
    li_pos += amount;
}