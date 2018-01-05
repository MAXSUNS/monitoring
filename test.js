/**
 * Created by sund on 2017/6/15.
 */
// var tmp =new Date();
// function f() {
//     console.log(tmp);
//     if (false){
//         var tmp = 'hello';
//     }
// }
// f();
// console.log(tmp);
//


// var s='hello';
// for (var i=0;i<s.length;i++){
//     setTimeout(function () {
//         let z=s[i];
//         console.log(s[i]);
//     },1000)
// }
// console.log(i);

// var f=function () {console.log(this)};
// var foo=()=>{console.log(this)}
// var obj={hello:'world'}
// var others = {hello:'others'}
// var g=f.bind(obj);
//
// f(); foo(); g();
// f.apply(obj); foo().apply(obj); g.apply(others);

var s = 'hello';

for (var i = 0; i < s.length; i++){
    console.log(s[i]);
}

console.log(i); // 5