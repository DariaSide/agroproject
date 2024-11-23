async function create_cur_for_rub (){
    let value_rub = parseFloat(document.getElementById("rub-input").value);
    let list_curs = document.getElementById("list-cur").children;
    for (let div_cur of list_curs) {
        let name_cur = div_cur.getElementsByTagName("span")[0].textContent;
        let value_cur = await eel.convert_value_py(value_rub, "RUB", name_cur)();
        div_cur.getElementsByTagName("input")[0].value = value_cur;
    }
}
document.getElementById("btn-sum").onclick = create_cur_for_rub;