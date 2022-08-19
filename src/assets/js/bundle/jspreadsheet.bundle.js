var formula=(function(){var error=(function(){var exports={};exports.nil=new Error('#NULL!');exports.div0=new Error('#DIV/0!');exports.value=new Error('#VALUE!');exports.ref=new Error('#REF!');exports.name=new Error('#NAME?');exports.num=new Error('#NUM!');exports.na=new Error('#N/A');exports.error=new Error('#ERROR!');exports.data=new Error('#GETTING_DATA');return exports;})();var utils=(function(){var exports={};exports.flattenShallow=function(array){if(!array||!array.reduce){return array;}
return array.reduce(function(a,b){var aIsArray=Array.isArray(a);var bIsArray=Array.isArray(b);if(aIsArray&&bIsArray){return a.concat(b);}
if(aIsArray){a.push(b);return a;}
if(bIsArray){return[a].concat(b);}
return[a,b];});};exports.isFlat=function(array){if(!array){return false;}
for(var i=0;i<array.length;++i){if(Array.isArray(array[i])){return false;}}
return true;};exports.flatten=function(){var result=exports.argsToArray.apply(null,arguments);while(!exports.isFlat(result)){result=exports.flattenShallow(result);}
return result;};exports.argsToArray=function(args){var result=[];exports.arrayEach(args,function(value){result.push(value);});return result;};exports.numbers=function(){var possibleNumbers=this.flatten.apply(null,arguments);return possibleNumbers.filter(function(el){return typeof el==='number';});};exports.cleanFloat=function(number){var power=1e14;return Math.round(number*power)/power;};exports.parseBool=function(bool){if(typeof bool==='boolean'){return bool;}
if(bool instanceof Error){return bool;}
if(typeof bool==='number'){return bool!==0;}
if(typeof bool==='string'){var up=bool.toUpperCase();if(up==='TRUE'){return true;}
if(up==='FALSE'){return false;}}
if(bool instanceof Date&&!isNaN(bool)){return true;}
return error.value;};exports.parseNumber=function(string){if(string===undefined||string===''){return error.value;}
if(!isNaN(string)){return parseFloat(string);}
return error.value;};exports.parseNumberArray=function(arr){var len;if(!arr||(len=arr.length)===0){return error.value;}
var parsed;while(len--){parsed=exports.parseNumber(arr[len]);if(parsed===error.value){return parsed;}
arr[len]=parsed;}
return arr;};exports.parseMatrix=function(matrix){var n;if(!matrix||(n=matrix.length)===0){return error.value;}
var pnarr;for(var i=0;i<matrix.length;i++){pnarr=exports.parseNumberArray(matrix[i]);matrix[i]=pnarr;if(pnarr instanceof Error){return pnarr;}}
return matrix;};var d1900=new Date(Date.UTC(1900,0,1));exports.parseDate=function(date){if(!isNaN(date)){if(date instanceof Date){return new Date(date);}
var d=parseInt(date,10);if(d<0){return error.num;}
if(d<=60){return new Date(d1900.getTime()+(d-1)*86400000);}
return new Date(d1900.getTime()+(d-2)*86400000);}
if(typeof date==='string'){date=new Date(date);if(!isNaN(date)){return date;}}
return error.value;};exports.parseDateArray=function(arr){var len=arr.length;var parsed;while(len--){parsed=this.parseDate(arr[len]);if(parsed===error.value){return parsed;}
arr[len]=parsed;}
return arr;};exports.anyIsError=function(){var n=arguments.length;while(n--){if(arguments[n]instanceof Error){return true;}}
return false;};exports.arrayValuesToNumbers=function(arr){var n=arr.length;var el;while(n--){el=arr[n];if(typeof el==='number'){continue;}
if(el===true){arr[n]=1;continue;}
if(el===false){arr[n]=0;continue;}
if(typeof el==='string'){var number=this.parseNumber(el);if(number instanceof Error){arr[n]=0;}else{arr[n]=number;}}}
return arr;};exports.rest=function(array,idx){idx=idx||1;if(!array||typeof array.slice!=='function'){return array;}
return array.slice(idx);};exports.initial=function(array,idx){idx=idx||1;if(!array||typeof array.slice!=='function'){return array;}
return array.slice(0,array.length-idx);};exports.arrayEach=function(array,iteratee){var index=-1,length=array.length;while(++index<length){if(iteratee(array[index],index,array)===false){break;}}
return array;};exports.transpose=function(matrix){if(!matrix){return error.value;}
return matrix[0].map(function(col,i){return matrix.map(function(row){return row[i];});});};return exports;})();var met={};met.datetime=(function(){var exports={};var d1900=new Date(1900,0,1);var WEEK_STARTS=[undefined,0,1,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,1,2,3,4,5,6,0];var WEEK_TYPES=[[],[1,2,3,4,5,6,7],[7,1,2,3,4,5,6],[6,0,1,2,3,4,5],[],[],[],[],[],[],[],[7,1,2,3,4,5,6],[6,7,1,2,3,4,5],[5,6,7,1,2,3,4],[4,5,6,7,1,2,3],[3,4,5,6,7,1,2],[2,3,4,5,6,7,1],[1,2,3,4,5,6,7]];var WEEKEND_TYPES=[[],[6,0],[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],undefined,undefined,undefined,[0,0],[1,1],[2,2],[3,3],[4,4],[5,5],[6,6]];exports.DATE=function(year,month,day){year=utils.parseNumber(year);month=utils.parseNumber(month);day=utils.parseNumber(day);if(utils.anyIsError(year,month,day)){return error.value;}
if(year<0||month<0||day<0){return error.num;}
var date=new Date(year,month-1,day);return date;};exports.DATEVALUE=function(date_text){if(typeof date_text!=='string'){return error.value;}
var date=Date.parse(date_text);if(isNaN(date)){return error.value;}
if(date<=-2203891200000){return(date-d1900)/86400000+1;}
return(date-d1900)/86400000+2;};exports.DAY=function(serial_number){var date=utils.parseDate(serial_number);if(date instanceof Error){return date;}
return date.getDate();};exports.DAYS=function(end_date,start_date){end_date=utils.parseDate(end_date);start_date=utils.parseDate(start_date);if(end_date instanceof Error){return end_date;}
if(start_date instanceof Error){return start_date;}
return serial(end_date)-serial(start_date);};exports.DAYS360=function(start_date,end_date,method){};exports.EDATE=function(start_date,months){start_date=utils.parseDate(start_date);if(start_date instanceof Error){return start_date;}
if(isNaN(months)){return error.value;}
months=parseInt(months,10);start_date.setMonth(start_date.getMonth()+months);return serial(start_date);};exports.EOMONTH=function(start_date,months){start_date=utils.parseDate(start_date);if(start_date instanceof Error){return start_date;}
if(isNaN(months)){return error.value;}
months=parseInt(months,10);return serial(new Date(start_date.getFullYear(),start_date.getMonth()+months+1,0));};exports.HOUR=function(serial_number){serial_number=utils.parseDate(serial_number);if(serial_number instanceof Error){return serial_number;}
return serial_number.getHours();};exports.INTERVAL=function(second){if(typeof second!=='number'&&typeof second!=='string'){return error.value;}else{second=parseInt(second,10);}
var year=Math.floor(second/946080000);second=second%946080000;var month=Math.floor(second/2592000);second=second%2592000;var day=Math.floor(second/86400);second=second%86400;var hour=Math.floor(second/3600);second=second%3600;var min=Math.floor(second/60);second=second%60;var sec=second;year=(year>0)?year+'Y':'';month=(month>0)?month+'M':'';day=(day>0)?day+'D':'';hour=(hour>0)?hour+'H':'';min=(min>0)?min+'M':'';sec=(sec>0)?sec+'S':'';return 'P'+year+month+day+'T'+hour+min+sec;};exports.ISOWEEKNUM=function(date){date=utils.parseDate(date);if(date instanceof Error){return date;}
date.setHours(0,0,0);date.setDate(date.getDate()+4-(date.getDay()||7));var yearStart=new Date(date.getFullYear(),0,1);return Math.ceil((((date-yearStart)/86400000)+1)/7);};exports.MINUTE=function(serial_number){serial_number=utils.parseDate(serial_number);if(serial_number instanceof Error){return serial_number;}
return serial_number.getMinutes();};exports.MONTH=function(serial_number){serial_number=utils.parseDate(serial_number);if(serial_number instanceof Error){return serial_number;}
return serial_number.getMonth()+1;};exports.NETWORKDAYS=function(start_date,end_date,holidays){};exports.NETWORKDAYS.INTL=function(start_date,end_date,weekend,holidays){};exports.NOW=function(){return new Date();};exports.SECOND=function(serial_number){serial_number=utils.parseDate(serial_number);if(serial_number instanceof Error){return serial_number;}
return serial_number.getSeconds();};exports.TIME=function(hour,minute,second){hour=utils.parseNumber(hour);minute=utils.parseNumber(minute);second=utils.parseNumber(second);if(utils.anyIsError(hour,minute,second)){return error.value;}
if(hour<0||minute<0||second<0){return error.num;}
return(3600*hour+60*minute+second)/86400;};exports.TIMEVALUE=function(time_text){time_text=utils.parseDate(time_text);if(time_text instanceof Error){return time_text;}
return(3600*time_text.getHours()+60*time_text.getMinutes()+time_text.getSeconds())/86400;};exports.TODAY=function(){return new Date();};exports.WEEKDAY=function(serial_number,return_type){serial_number=utils.parseDate(serial_number);if(serial_number instanceof Error){return serial_number;}
if(return_type===undefined){return_type=1;}
var day=serial_number.getDay();return WEEK_TYPES[return_type][day];};exports.WEEKNUM=function(serial_number,return_type){};exports.WORKDAY=function(start_date,days,holidays){};exports.WORKDAY.INTL=function(start_date,days,weekend,holidays){};exports.YEAR=function(serial_number){serial_number=utils.parseDate(serial_number);if(serial_number instanceof Error){return serial_number;}
return serial_number.getFullYear();};function isLeapYear(year){return new Date(year,1,29).getMonth()===1;}
exports.YEARFRAC=function(start_date,end_date,basis){};function serial(date){var addOn=(date>-2203891200000)?2:1;return(date-d1900)/86400000+addOn;}
return exports;})();met.database=(function(){var exports={};function compact(array){if(!array){return array;}
var result=[];for(var i=0;i<array.length;++i){if(!array[i]){continue;}
result.push(array[i]);}
return result;}
exports.FINDFIELD=function(database,title){var index=null;for(var i=0;i<database.length;i++){if(database[i][0]===title){index=i;break;}}
if(index==null){return error.value;}
return index;};function findResultIndex(database,criterias){var matches={};for(var i=1;i<database[0].length;++i){matches[i]=true;}
var maxCriteriaLength=criterias[0].length;for(i=1;i<criterias.length;++i){if(criterias[i].length>maxCriteriaLength){maxCriteriaLength=criterias[i].length;}}
for(var k=1;k<database.length;++k){for(var l=1;l<database[k].length;++l){var currentCriteriaResult=false;var hasMatchingCriteria=false;for(var j=0;j<criterias.length;++j){var criteria=criterias[j];if(criteria.length<maxCriteriaLength){continue;}
var criteriaField=criteria[0];if(database[k][0]!==criteriaField){continue;}
hasMatchingCriteria=true;for(var p=1;p<criteria.length;++p){currentCriteriaResult=currentCriteriaResult||eval(database[k][l]+criteria[p]);}}
if(hasMatchingCriteria){matches[l]=matches[l]&&currentCriteriaResult;}}}
var result=[];for(var n=0;n<database[0].length;++n){if(matches[n]){result.push(n-1);}}
return result;}
exports.DAVERAGE=function(database,field,criteria){if(isNaN(field)&&(typeof field!=="string")){return error.value;}
var resultIndexes=findResultIndex(database,criteria);var targetFields=[];if(typeof field==="string"){var index=exports.FINDFIELD(database,field);targetFields=utils.rest(database[index]);}else{targetFields=utils.rest(database[field]);}
var sum=0;for(var i=0;i<resultIndexes.length;i++){sum+=targetFields[resultIndexes[i]];}
return resultIndexes.length===0?error.div0:sum/resultIndexes.length;};exports.DCOUNT=function(database,field,criteria){};exports.DCOUNTA=function(database,field,criteria){};exports.DGET=function(database,field,criteria){if(isNaN(field)&&(typeof field!=="string")){return error.value;}
var resultIndexes=findResultIndex(database,criteria);var targetFields=[];if(typeof field==="string"){var index=exports.FINDFIELD(database,field);targetFields=utils.rest(database[index]);}else{targetFields=utils.rest(database[field]);}
if(resultIndexes.length===0){return error.value;}
if(resultIndexes.length>1){return error.num;}
return targetFields[resultIndexes[0]];};exports.DMAX=function(database,field,criteria){if(isNaN(field)&&(typeof field!=="string")){return error.value;}
var resultIndexes=findResultIndex(database,criteria);var targetFields=[];if(typeof field==="string"){var index=exports.FINDFIELD(database,field);targetFields=utils.rest(database[index]);}else{targetFields=utils.rest(database[field]);}
var maxValue=targetFields[resultIndexes[0]];for(var i=1;i<resultIndexes.length;i++){if(maxValue<targetFields[resultIndexes[i]]){maxValue=targetFields[resultIndexes[i]];}}
return maxValue;};exports.DMIN=function(database,field,criteria){if(isNaN(field)&&(typeof field!=="string")){return error.value;}
var resultIndexes=findResultIndex(database,criteria);var targetFields=[];if(typeof field==="string"){var index=exports.FINDFIELD(database,field);targetFields=utils.rest(database[index]);}else{targetFields=utils.rest(database[field]);}
var minValue=targetFields[resultIndexes[0]];for(var i=1;i<resultIndexes.length;i++){if(minValue>targetFields[resultIndexes[i]]){minValue=targetFields[resultIndexes[i]];}}
return minValue;};exports.DPRODUCT=function(database,field,criteria){if(isNaN(field)&&(typeof field!=="string")){return error.value;}
var resultIndexes=findResultIndex(database,criteria);var targetFields=[];if(typeof field==="string"){var index=exports.FINDFIELD(database,field);targetFields=utils.rest(database[index]);}else{targetFields=utils.rest(database[field]);}
var targetValues=[];for(var i=0;i<resultIndexes.length;i++){targetValues[i]=targetFields[resultIndexes[i]];}
targetValues=compact(targetValues);var result=1;for(i=0;i<targetValues.length;i++){result*=targetValues[i];}
return result;};exports.DSTDEV=function(database,field,criteria){};exports.DSTDEVP=function(database,field,criteria){};exports.DSUM=function(database,field,criteria){};exports.DVAR=function(database,field,criteria){};exports.DVARP=function(database,field,criteria){};exports.MATCH=function(lookupValue,lookupArray,matchType){if(!lookupValue&&!lookupArray){return error.na;}
if(arguments.length===2){matchType=1;}
if(!(lookupArray instanceof Array)){return error.na;}
if(matchType!==-1&&matchType!==0&&matchType!==1){return error.na;}
var index;var indexValue;for(var idx=0;idx<lookupArray.length;idx++){if(matchType===1){if(lookupArray[idx]===lookupValue){return idx+1;}else if(lookupArray[idx]<lookupValue){if(!indexValue){index=idx+1;indexValue=lookupArray[idx];}else if(lookupArray[idx]>indexValue){index=idx+1;indexValue=lookupArray[idx];}}}else if(matchType===0){if(typeof lookupValue==='string'){lookupValue=lookupValue.replace(/\?/g,'.');if(lookupArray[idx].toLowerCase().match(lookupValue.toLowerCase())){return idx+1;}}else{if(lookupArray[idx]===lookupValue){return idx+1;}}}else if(matchType===-1){if(lookupArray[idx]===lookupValue){return idx+1;}else if(lookupArray[idx]>lookupValue){if(!indexValue){index=idx+1;indexValue=lookupArray[idx];}else if(lookupArray[idx]<indexValue){index=idx+1;indexValue=lookupArray[idx];}}}}
return index?index:error.na;};return exports;})();met.engineering=(function(){var exports={};function isValidBinaryNumber(number){return(/^[01]{1,10}$/).test(number);}
exports.BESSELI=function(x,n){};exports.BESSELJ=function(x,n){};exports.BESSELK=function(x,n){};exports.BESSELY=function(x,n){};exports.BIN2DEC=function(number){if(!isValidBinaryNumber(number)){return error.num;}
var result=parseInt(number,2);var stringified=number.toString();if(stringified.length===10&&stringified.substring(0,1)==='1'){return parseInt(stringified.substring(1),2)-512;}else{return result;}};exports.BIN2HEX=function(number,places){if(!isValidBinaryNumber(number)){return error.num;}
var stringified=number.toString();if(stringified.length===10&&stringified.substring(0,1)==='1'){return(1099511627264+parseInt(stringified.substring(1),2)).toString(16);}
var result=parseInt(number,2).toString(16);if(places===undefined){return result;}else{if(isNaN(places)){return error.value;}
if(places<0){return error.num;}
places=Math.floor(places);return(places>=result.length)?REPT('0',places-result.length)+result:error.num;}};exports.BIN2OCT=function(number,places){if(!isValidBinaryNumber(number)){return error.num;}
var stringified=number.toString();if(stringified.length===10&&stringified.substring(0,1)==='1'){return(1073741312+parseInt(stringified.substring(1),2)).toString(8);}
var result=parseInt(number,2).toString(8);if(places===undefined){return result;}else{if(isNaN(places)){return error.value;}
if(places<0){return error.num;}
places=Math.floor(places);return(places>=result.length)?REPT('0',places-result.length)+result:error.num;}};exports.BITAND=function(number1,number2){number1=utils.parseNumber(number1);number2=utils.parseNumber(number2);if(utils.anyIsError(number1,number2)){return error.value;}
if(number1<0||number2<0){return error.num;}
if(Math.floor(number1)!==number1||Math.floor(number2)!==number2){return error.num;}
if(number1>281474976710655||number2>281474976710655){return error.num;}
return number1&number2;};exports.BITLSHIFT=function(number,shift){number=utils.parseNumber(number);shift=utils.parseNumber(shift);if(utils.anyIsError(number,shift)){return error.value;}
if(number<0){return error.num;}
if(Math.floor(number)!==number){return error.num;}
if(number>281474976710655){return error.num;}
if(Math.abs(shift)>53){return error.num;}
return(shift>=0)?number<<shift:number>>-shift;};exports.BITOR=function(number1,number2){number1=utils.parseNumber(number1);number2=utils.parseNumber(number2);if(utils.anyIsError(number1,number2)){return error.value;}
if(number1<0||number2<0){return error.num;}
if(Math.floor(number1)!==number1||Math.floor(number2)!==number2){return error.num;}
if(number1>281474976710655||number2>281474976710655){return error.num;}
return number1|number2;};exports.BITRSHIFT=function(number,shift){number=utils.parseNumber(number);shift=utils.parseNumber(shift);if(utils.anyIsError(number,shift)){return error.value;}
if(number<0){return error.num;}
if(Math.floor(number)!==number){return error.num;}
if(number>281474976710655){return error.num;}
if(Math.abs(shift)>53){return error.num;}
return(shift>=0)?number>>shift:number<<-shift;};exports.BITXOR=function(number1,number2){number1=utils.parseNumber(number1);number2=utils.parseNumber(number2);if(utils.anyIsError(number1,number2)){return error.value;}
if(number1<0||number2<0){return error.num;}
if(Math.floor(number1)!==number1||Math.floor(number2)!==number2){return error.num;}
if(number1>281474976710655||number2>281474976710655){return error.num;}
return number1^number2;};exports.COMPLEX=function(real,imaginary,suffix){real=utils.parseNumber(real);imaginary=utils.parseNumber(imaginary);if(utils.anyIsError(real,imaginary)){return real;}
suffix=(suffix===undefined)?'i':suffix;if(suffix!=='i'&&suffix!=='j'){return error.value;}
if(real===0&&imaginary===0){return 0;}else if(real===0){return(imaginary===1)?suffix:imaginary.toString()+suffix;}else if(imaginary===0){return real.toString();}else{var sign=(imaginary>0)?'+':'';return real.toString()+sign+((imaginary===1)?suffix:imaginary.toString()+suffix);}};exports.CONVERT=function(number,from_unit,to_unit){number=utils.parseNumber(number);if(number instanceof Error){return number;}
var units=[["a.u. of action","?",null,"action",false,false,1.05457168181818e-34],["a.u. of charge","e",null,"electric_charge",false,false,1.60217653141414e-19],["a.u. of energy","Eh",null,"energy",false,false,4.35974417757576e-18],["a.u. of length","a?",null,"length",false,false,5.29177210818182e-11],["a.u. of mass","m?",null,"mass",false,false,9.10938261616162e-31],["a.u. of time","?/Eh",null,"time",false,false,2.41888432650516e-17],["admiralty knot","admkn",null,"speed",false,true,0.514773333],["ampere","A",null,"electric_current",true,false,1],["ampere per meter","A/m",null,"magnetic_field_intensity",true,false,1],["ångström","Å",["ang"],"length",false,true,1e-10],["are","ar",null,"area",false,true,100],["astronomical unit","ua",null,"length",false,false,1.49597870691667e-11],["bar","bar",null,"pressure",false,false,100000],["barn","b",null,"area",false,false,1e-28],["becquerel","Bq",null,"radioactivity",true,false,1],["bit","bit",["b"],"information",false,true,1],["btu","BTU",["btu"],"energy",false,true,1055.05585262],["byte","byte",null,"information",false,true,8],["candela","cd",null,"luminous_intensity",true,false,1],["candela per square metre","cd/m?",null,"luminance",true,false,1],["coulomb","C",null,"electric_charge",true,false,1],["cubic ångström","ang3",["ang^3"],"volume",false,true,1e-30],["cubic foot","ft3",["ft^3"],"volume",false,true,0.028316846592],["cubic inch","in3",["in^3"],"volume",false,true,0.000016387064],["cubic light-year","ly3",["ly^3"],"volume",false,true,8.46786664623715e-47],["cubic metre","m?",null,"volume",true,true,1],["cubic mile","mi3",["mi^3"],"volume",false,true,4168181825.44058],["cubic nautical mile","Nmi3",["Nmi^3"],"volume",false,true,6352182208],["cubic Pica","Pica3",["Picapt3","Pica^3","Picapt^3"],"volume",false,true,7.58660370370369e-8],["cubic yard","yd3",["yd^3"],"volume",false,true,0.764554857984],["cup","cup",null,"volume",false,true,0.0002365882365],["dalton","Da",["u"],"mass",false,false,1.66053886282828e-27],["day","d",["day"],"time",false,true,86400],["degree","°",null,"angle",false,false,0.0174532925199433],["degrees Rankine","Rank",null,"temperature",false,true,0.555555555555556],["dyne","dyn",["dy"],"force",false,true,0.00001],["electronvolt","eV",["ev"],"energy",false,true,1.60217656514141],["ell","ell",null,"length",false,true,1.143],["erg","erg",["e"],"energy",false,true,1e-7],["farad","F",null,"electric_capacitance",true,false,1],["fluid ounce","oz",null,"volume",false,true,0.0000295735295625],["foot","ft",null,"length",false,true,0.3048],["foot-pound","flb",null,"energy",false,true,1.3558179483314],["gal","Gal",null,"acceleration",false,false,0.01],["gallon","gal",null,"volume",false,true,0.003785411784],["gauss","G",["ga"],"magnetic_flux_density",false,true,1],["grain","grain",null,"mass",false,true,0.0000647989],["gram","g",null,"mass",false,true,0.001],["gray","Gy",null,"absorbed_dose",true,false,1],["gross registered ton","GRT",["regton"],"volume",false,true,2.8316846592],["hectare","ha",null,"area",false,true,10000],["henry","H",null,"inductance",true,false,1],["hertz","Hz",null,"frequency",true,false,1],["horsepower","HP",["h"],"power",false,true,745.69987158227],["horsepower-hour","HPh",["hh","hph"],"energy",false,true,2684519.538],["hour","h",["hr"],"time",false,true,3600],["imperial gallon (U.K.)","uk_gal",null,"volume",false,true,0.00454609],["imperial hundredweight","lcwt",["uk_cwt","hweight"],"mass",false,true,50.802345],["imperial quart (U.K)","uk_qt",null,"volume",false,true,0.0011365225],["imperial ton","brton",["uk_ton","LTON"],"mass",false,true,1016.046909],["inch","in",null,"length",false,true,0.0254],["international acre","uk_acre",null,"area",false,true,4046.8564224],["IT calorie","cal",null,"energy",false,true,4.1868],["joule","J",null,"energy",true,true,1],["katal","kat",null,"catalytic_activity",true,false,1],["kelvin","K",["kel"],"temperature",true,true,1],["kilogram","kg",null,"mass",true,true,1],["knot","kn",null,"speed",false,true,0.514444444444444],["light-year","ly",null,"length",false,true,9460730472580800],["litre","L",["l","lt"],"volume",false,true,0.001],["lumen","lm",null,"luminous_flux",true,false,1],["lux","lx",null,"illuminance",true,false,1],["maxwell","Mx",null,"magnetic_flux",false,false,1e-18],["measurement ton","MTON",null,"volume",false,true,1.13267386368],["meter per hour","m/h",["m/hr"],"speed",false,true,0.00027777777777778],["meter per second","m/s",["m/sec"],"speed",true,true,1],["meter per second squared","m?s??",null,"acceleration",true,false,1],["parsec","pc",["parsec"],"length",false,true,30856775814671900],["meter squared per second","m?/s",null,"kinematic_viscosity",true,false,1],["metre","m",null,"length",true,true,1],["miles per hour","mph",null,"speed",false,true,0.44704],["millimetre of mercury","mmHg",null,"pressure",false,false,133.322],["minute","?",null,"angle",false,false,0.000290888208665722],["minute","min",["mn"],"time",false,true,60],["modern teaspoon","tspm",null,"volume",false,true,0.000005],["mole","mol",null,"amount_of_substance",true,false,1],["morgen","Morgen",null,"area",false,true,2500],["n.u. of action","?",null,"action",false,false,1.05457168181818e-34],["n.u. of mass","m?",null,"mass",false,false,9.10938261616162e-31],["n.u. of speed","c?",null,"speed",false,false,299792458],["n.u. of time","?/(me?c??)",null,"time",false,false,1.28808866778687e-21],["nautical mile","M",["Nmi"],"length",false,true,1852],["newton","N",null,"force",true,true,1],["œrsted","Oe ",null,"magnetic_field_intensity",false,false,79.5774715459477],["ohm","Ω",null,"electric_resistance",true,false,1],["ounce mass","ozm",null,"mass",false,true,0.028349523125],["pascal","Pa",null,"pressure",true,false,1],["pascal second","Pa?s",null,"dynamic_viscosity",true,false,1],["pferdestärke","PS",null,"power",false,true,735.49875],["phot","ph",null,"illuminance",false,false,0.0001],["pica (1/6 inch)","pica",null,"length",false,true,0.00035277777777778],["pica (1/72 inch)","Pica",["Picapt"],"length",false,true,0.00423333333333333],["poise","P",null,"dynamic_viscosity",false,false,0.1],["pond","pond",null,"force",false,true,0.00980665],["pound force","lbf",null,"force",false,true,4.4482216152605],["pound mass","lbm",null,"mass",false,true,0.45359237],["quart","qt",null,"volume",false,true,0.000946352946],["radian","rad",null,"angle",true,false,1],["second","?",null,"angle",false,false,0.00000484813681109536],["second","s",["sec"],"time",true,true,1],["short hundredweight","cwt",["shweight"],"mass",false,true,45.359237],["siemens","S",null,"electrical_conductance",true,false,1],["sievert","Sv",null,"equivalent_dose",true,false,1],["slug","sg",null,"mass",false,true,14.59390294],["square ångström","ang2",["ang^2"],"area",false,true,1e-20],["square foot","ft2",["ft^2"],"area",false,true,0.09290304],["square inch","in2",["in^2"],"area",false,true,0.00064516],["square light-year","ly2",["ly^2"],"area",false,true,8.95054210748189e+31],["square meter","m?",null,"area",true,true,1],["square mile","mi2",["mi^2"],"area",false,true,2589988.110336],["square nautical mile","Nmi2",["Nmi^2"],"area",false,true,3429904],["square Pica","Pica2",["Picapt2","Pica^2","Picapt^2"],"area",false,true,0.00001792111111111],["square yard","yd2",["yd^2"],"area",false,true,0.83612736],["statute mile","mi",null,"length",false,true,1609.344],["steradian","sr",null,"solid_angle",true,false,1],["stilb","sb",null,"luminance",false,false,0.0001],["stokes","St",null,"kinematic_viscosity",false,false,0.0001],["stone","stone",null,"mass",false,true,6.35029318],["tablespoon","tbs",null,"volume",false,true,0.0000147868],["teaspoon","tsp",null,"volume",false,true,0.00000492892],["tesla","T",null,"magnetic_flux_density",true,true,1],["thermodynamic calorie","c",null,"energy",false,true,4.184],["ton","ton",null,"mass",false,true,907.18474],["tonne","t",null,"mass",false,false,1000],["U.K. pint","uk_pt",null,"volume",false,true,0.00056826125],["U.S. bushel","bushel",null,"volume",false,true,0.03523907],["U.S. oil barrel","barrel",null,"volume",false,true,0.158987295],["U.S. pint","pt",["us_pt"],"volume",false,true,0.000473176473],["U.S. survey mile","survey_mi",null,"length",false,true,1609.347219],["U.S. survey/statute acre","us_acre",null,"area",false,true,4046.87261],["volt","V",null,"voltage",true,false,1],["watt","W",null,"power",true,true,1],["watt-hour","Wh",["wh"],"energy",false,true,3600],["weber","Wb",null,"magnetic_flux",true,false,1],["yard","yd",null,"length",false,true,0.9144],["year","yr",null,"time",false,true,31557600]];var binary_prefixes={Yi:["yobi",80,1208925819614629174706176,"Yi","yotta"],Zi:["zebi",70,1180591620717411303424,"Zi","zetta"],Ei:["exbi",60,1152921504606846976,"Ei","exa"],Pi:["pebi",50,1125899906842624,"Pi","peta"],Ti:["tebi",40,1099511627776,"Ti","tera"],Gi:["gibi",30,1073741824,"Gi","giga"],Mi:["mebi",20,1048576,"Mi","mega"],ki:["kibi",10,1024,"ki","kilo"]};var unit_prefixes={Y:["yotta",1e+24,"Y"],Z:["zetta",1e+21,"Z"],E:["exa",1e+18,"E"],P:["peta",1e+15,"P"],T:["tera",1e+12,"T"],G:["giga",1e+09,"G"],M:["mega",1e+06,"M"],k:["kilo",1e+03,"k"],h:["hecto",1e+02,"h"],e:["dekao",1e+01,"e"],d:["deci",1e-01,"d"],c:["centi",1e-02,"c"],m:["milli",1e-03,"m"],u:["micro",1e-06,"u"],n:["nano",1e-09,"n"],p:["pico",1e-12,"p"],f:["femto",1e-15,"f"],a:["atto",1e-18,"a"],z:["zepto",1e-21,"z"],y:["yocto",1e-24,"y"]};var from=null;var to=null;var base_from_unit=from_unit;var base_to_unit=to_unit;var from_multiplier=1;var to_multiplier=1;var alt;for(var i=0;i<units.length;i++){alt=(units[i][2]===null)?[]:units[i][2];if(units[i][1]===base_from_unit||alt.indexOf(base_from_unit)>=0){from=units[i];}
if(units[i][1]===base_to_unit||alt.indexOf(base_to_unit)>=0){to=units[i];}}
if(from===null){var from_binary_prefix=binary_prefixes[from_unit.substring(0,2)];var from_unit_prefix=unit_prefixes[from_unit.substring(0,1)];if(from_unit.substring(0,2)==='da'){from_unit_prefix=["dekao",1e+01,"da"];}
if(from_binary_prefix){from_multiplier=from_binary_prefix[2];base_from_unit=from_unit.substring(2);}else if(from_unit_prefix){from_multiplier=from_unit_prefix[1];base_from_unit=from_unit.substring(from_unit_prefix[2].length);}
for(var j=0;j<units.length;j++){alt=(units[j][2]===null)?[]:units[j][2];if(units[j][1]===base_from_unit||alt.indexOf(base_from_unit)>=0){from=units[j];}}}
if(to===null){var to_binary_prefix=binary_prefixes[to_unit.substring(0,2)];var to_unit_prefix=unit_prefixes[to_unit.substring(0,1)];if(to_unit.substring(0,2)==='da'){to_unit_prefix=["dekao",1e+01,"da"];}
if(to_binary_prefix){to_multiplier=to_binary_prefix[2];base_to_unit=to_unit.substring(2);}else if(to_unit_prefix){to_multiplier=to_unit_prefix[1];base_to_unit=to_unit.substring(to_unit_prefix[2].length);}
for(var k=0;k<units.length;k++){alt=(units[k][2]===null)?[]:units[k][2];if(units[k][1]===base_to_unit||alt.indexOf(base_to_unit)>=0){to=units[k];}}}
if(from===null||to===null){return error.na;}
if(from[3]!==to[3]){return error.na;}
return number*from[6]*from_multiplier/(to[6]*to_multiplier);};exports.DEC2BIN=function(number,places){number=utils.parseNumber(number);if(number instanceof Error){return number;}
if(!/^-?[0-9]{1,3}$/.test(number)||number<-512||number>511){return error.num;}
if(number<0){return '1'+REPT('0',9-(512+number).toString(2).length)+(512+number).toString(2);}
var result=parseInt(number,10).toString(2);if(typeof places==='undefined'){return result;}else{if(isNaN(places)){return error.value;}
if(places<0){return error.num;}
places=Math.floor(places);return(places>=result.length)?REPT('0',places-result.length)+result:error.num;}};exports.DEC2HEX=function(number,places){number=utils.parseNumber(number);if(number instanceof Error){return number;}
if(!/^-?[0-9]{1,12}$/.test(number)||number<-549755813888||number>549755813887){return error.num;}
if(number<0){return(1099511627776+number).toString(16);}
var result=parseInt(number,10).toString(16);if(typeof places==='undefined'){return result;}else{if(isNaN(places)){return error.value;}
if(places<0){return error.num;}
places=Math.floor(places);return(places>=result.length)?REPT('0',places-result.length)+result:error.num;}};exports.DEC2OCT=function(number,places){number=utils.parseNumber(number);if(number instanceof Error){return number;}
if(!/^-?[0-9]{1,9}$/.test(number)||number<-536870912||number>536870911){return error.num;}
if(number<0){return(1073741824+number).toString(8);}
var result=parseInt(number,10).toString(8);if(typeof places==='undefined'){return result;}else{if(isNaN(places)){return error.value;}
if(places<0){return error.num;}
places=Math.floor(places);return(places>=result.length)?REPT('0',places-result.length)+result:error.num;}};exports.DELTA=function(number1,number2){number2=(number2===undefined)?0:number2;number1=utils.parseNumber(number1);number2=utils.parseNumber(number2);if(utils.anyIsError(number1,number2)){return error.value;}
return(number1===number2)?1:0;};exports.ERF=function(lower_bound,upper_bound){};exports.ERF.PRECISE=function(){};exports.ERFC=function(x){};exports.ERFC.PRECISE=function(){};exports.GESTEP=function(number,step){step=step||0;number=utils.parseNumber(number);if(utils.anyIsError(step,number)){return number;}
return(number>=step)?1:0;};exports.HEX2BIN=function(number,places){if(!/^[0-9A-Fa-f]{1,10}$/.test(number)){return error.num;}
var negative=(number.length===10&&number.substring(0,1).toLowerCase()==='f')?true:false;var decimal=(negative)?parseInt(number,16)-1099511627776:parseInt(number,16);if(decimal<-512||decimal>511){return error.num;}
if(negative){return '1'+REPT('0',9-(512+decimal).toString(2).length)+(512+decimal).toString(2);}
var result=decimal.toString(2);if(places===undefined){return result;}else{if(isNaN(places)){return error.value;}
if(places<0){return error.num;}
places=Math.floor(places);return(places>=result.length)?REPT('0',places-result.length)+result:error.num;}};exports.HEX2DEC=function(number){if(!/^[0-9A-Fa-f]{1,10}$/.test(number)){return error.num;}
var decimal=parseInt(number,16);return(decimal>=549755813888)?decimal-1099511627776:decimal;};exports.HEX2OCT=function(number,places){if(!/^[0-9A-Fa-f]{1,10}$/.test(number)){return error.num;}
var decimal=parseInt(number,16);if(decimal>536870911&&decimal<1098974756864){return error.num;}
if(decimal>=1098974756864){return(decimal-1098437885952).toString(8);}
var result=decimal.toString(8);if(places===undefined){return result;}else{if(isNaN(places)){return error.value;}
if(places<0){return error.num;}
places=Math.floor(places);return(places>=result.length)?REPT('0',places-result.length)+result:error.num;}};exports.IMABS=function(inumber){var x=exports.IMREAL(inumber);var y=exports.IMAGINARY(inumber);if(utils.anyIsError(x,y)){return error.value;}
return Math.sqrt(Math.pow(x,2)+Math.pow(y,2));};exports.IMAGINARY=function(inumber){if(inumber===undefined||inumber===true||inumber===false){return error.value;}
if(inumber===0||inumber==='0'){return 0;}
if(['i','j'].indexOf(inumber)>=0){return 1;}
inumber=inumber.replace('+i','+1i').replace('-i','-1i').replace('+j','+1j').replace('-j','-1j');var plus=inumber.indexOf('+');var minus=inumber.indexOf('-');if(plus===0){plus=inumber.indexOf('+',1);}
if(minus===0){minus=inumber.indexOf('-',1);}
var last=inumber.substring(inumber.length-1,inumber.length);var unit=(last==='i'||last==='j');if(plus>=0||minus>=0){if(!unit){return error.num;}
if(plus>=0){return(isNaN(inumber.substring(0,plus))||isNaN(inumber.substring(plus+1,inumber.length-1)))?error.num:Number(inumber.substring(plus+1,inumber.length-1));}else{return(isNaN(inumber.substring(0,minus))||isNaN(inumber.substring(minus+1,inumber.length-1)))?error.num:-Number(inumber.substring(minus+1,inumber.length-1));}}else{if(unit){return(isNaN(inumber.substring(0,inumber.length-1)))?error.num:inumber.substring(0,inumber.length-1);}else{return(isNaN(inumber))?error.num:0;}}};exports.IMARGUMENT=function(inumber){var x=exports.IMREAL(inumber);var y=exports.IMAGINARY(inumber);if(utils.anyIsError(x,y)){return error.value;}
if(x===0&&y===0){return error.div0;}
if(x===0&&y>0){return Math.PI/2;}
if(x===0&&y<0){return-Math.PI/2;}
if(y===0&&x>0){return 0;}
if(y===0&&x<0){return-Math.PI;}
if(x>0){return Math.atan(y/x);}else if(x<0&&y>=0){return Math.atan(y/x)+Math.PI;}else{return Math.atan(y/x)-Math.PI;}};exports.IMCONJUGATE=function(inumber){var x=exports.IMREAL(inumber);var y=exports.IMAGINARY(inumber);if(utils.anyIsError(x,y)){return error.value;}
var unit=inumber.substring(inumber.length-1);unit=(unit==='i'||unit==='j')?unit:'i';return(y!==0)?exports.COMPLEX(x,-y,unit):inumber;};exports.IMCOS=function(inumber){var x=exports.IMREAL(inumber);var y=exports.IMAGINARY(inumber);if(utils.anyIsError(x,y)){return error.value;}
var unit=inumber.substring(inumber.length-1);unit=(unit==='i'||unit==='j')?unit:'i';return exports.COMPLEX(Math.cos(x)*(Math.exp(y)+Math.exp(-y))/2,-Math.sin(x)*(Math.exp(y)-Math.exp(-y))/2,unit);};exports.IMCOSH=function(inumber){var x=exports.IMREAL(inumber);var y=exports.IMAGINARY(inumber);if(utils.anyIsError(x,y)){return error.value;}
var unit=inumber.substring(inumber.length-1);unit=(unit==='i'||unit==='j')?unit:'i';return exports.COMPLEX(Math.cos(y)*(Math.exp(x)+Math.exp(-x))/2,Math.sin(y)*(Math.exp(x)-Math.exp(-x))/2,unit);};exports.IMCOT=function(inumber){var x=exports.IMREAL(inumber);var y=exports.IMAGINARY(inumber);if(utils.anyIsError(x,y)){return error.value;}
return exports.IMDIV(exports.IMCOS(inumber),exports.IMSIN(inumber));};exports.IMDIV=function(inumber1,inumber2){var a=exports.IMREAL(inumber1);var b=exports.IMAGINARY(inumber1);var c=exports.IMREAL(inumber2);var d=exports.IMAGINARY(inumber2);if(utils.anyIsError(a,b,c,d)){return error.value;}
var unit1=inumber1.substring(inumber1.length-1);var unit2=inumber2.substring(inumber2.length-1);var unit='i';if(unit1==='j'){unit='j';}else if(unit2==='j'){unit='j';}
if(c===0&&d===0){return error.num;}
var den=c*c+d*d;return exports.COMPLEX((a*c+b*d)/den,(b*c-a*d)/den,unit);};exports.IMEXP=function(inumber){var x=exports.IMREAL(inumber);var y=exports.IMAGINARY(inumber);if(utils.anyIsError(x,y)){return error.value;}
var unit=inumber.substring(inumber.length-1);unit=(unit==='i'||unit==='j')?unit:'i';var e=Math.exp(x);return exports.COMPLEX(e*Math.cos(y),e*Math.sin(y),unit);};exports.IMLN=function(inumber){var x=exports.IMREAL(inumber);var y=exports.IMAGINARY(inumber);if(utils.anyIsError(x,y)){return error.value;}
var unit=inumber.substring(inumber.length-1);unit=(unit==='i'||unit==='j')?unit:'i';return exports.COMPLEX(Math.log(Math.sqrt(x*x+y*y)),Math.atan(y/x),unit);};exports.IMLOG10=function(inumber){var x=exports.IMREAL(inumber);var y=exports.IMAGINARY(inumber);if(utils.anyIsError(x,y)){return error.value;}
var unit=inumber.substring(inumber.length-1);unit=(unit==='i'||unit==='j')?unit:'i';return exports.COMPLEX(Math.log(Math.sqrt(x*x+y*y))/Math.log(10),Math.atan(y/x)/Math.log(10),unit);};exports.IMLOG2=function(inumber){var x=exports.IMREAL(inumber);var y=exports.IMAGINARY(inumber);if(utils.anyIsError(x,y)){return error.value;}
var unit=inumber.substring(inumber.length-1);unit=(unit==='i'||unit==='j')?unit:'i';return exports.COMPLEX(Math.log(Math.sqrt(x*x+y*y))/Math.log(2),Math.atan(y/x)/Math.log(2),unit);};exports.IMPOWER=function(inumber,number){number=utils.parseNumber(number);var x=exports.IMREAL(inumber);var y=exports.IMAGINARY(inumber);if(utils.anyIsError(number,x,y)){return error.value;}
var unit=inumber.substring(inumber.length-1);unit=(unit==='i'||unit==='j')?unit:'i';var p=Math.pow(exports.IMABS(inumber),number);var t=exports.IMARGUMENT(inumber);return exports.COMPLEX(p*Math.cos(number*t),p*Math.sin(number*t),unit);};exports.IMPRODUCT=function(){var result=arguments[0];for(var i=1;i<arguments.length;i++){var a=exports.IMREAL(result);var b=exports.IMAGINARY(result);var c=exports.IMREAL(arguments[i]);var d=exports.IMAGINARY(arguments[i]);if(utils.anyIsError(a,b,c,d)){return error.value;}
result=exports.COMPLEX(a*c-b*d,a*d+b*c);}
return result;};exports.IMREAL=function(inumber){if(inumber===undefined||inumber===true||inumber===false){return error.value;}
if(inumber===0||inumber==='0'){return 0;}
if(['i','+i','1i','+1i','-i','-1i','j','+j','1j','+1j','-j','-1j'].indexOf(inumber)>=0){return 0;}
var plus=inumber.indexOf('+');var minus=inumber.indexOf('-');if(plus===0){plus=inumber.indexOf('+',1);}
if(minus===0){minus=inumber.indexOf('-',1);}
var last=inumber.substring(inumber.length-1,inumber.length);var unit=(last==='i'||last==='j');if(plus>=0||minus>=0){if(!unit){return error.num;}
if(plus>=0){return(isNaN(inumber.substring(0,plus))||isNaN(inumber.substring(plus+1,inumber.length-1)))?error.num:Number(inumber.substring(0,plus));}else{return(isNaN(inumber.substring(0,minus))||isNaN(inumber.substring(minus+1,inumber.length-1)))?error.num:Number(inumber.substring(0,minus));}}else{if(unit){return(isNaN(inumber.substring(0,inumber.length-1)))?error.num:0;}else{return(isNaN(inumber))?error.num:inumber;}}};exports.IMSEC=function(inumber){if(inumber===true||inumber===false){return error.value;}
var x=exports.IMREAL(inumber);var y=exports.IMAGINARY(inumber);if(utils.anyIsError(x,y)){return error.value;}
return exports.IMDIV('1',exports.IMCOS(inumber));};exports.IMSECH=function(inumber){var x=exports.IMREAL(inumber);var y=exports.IMAGINARY(inumber);if(utils.anyIsError(x,y)){return error.value;}
return exports.IMDIV('1',exports.IMCOSH(inumber));};exports.IMSIN=function(inumber){var x=exports.IMREAL(inumber);var y=exports.IMAGINARY(inumber);if(utils.anyIsError(x,y)){return error.value;}
var unit=inumber.substring(inumber.length-1);unit=(unit==='i'||unit==='j')?unit:'i';return exports.COMPLEX(Math.sin(x)*(Math.exp(y)+Math.exp(-y))/2,Math.cos(x)*(Math.exp(y)-Math.exp(-y))/2,unit);};exports.IMSINH=function(inumber){var x=exports.IMREAL(inumber);var y=exports.IMAGINARY(inumber);if(utils.anyIsError(x,y)){return error.value;}
var unit=inumber.substring(inumber.length-1);unit=(unit==='i'||unit==='j')?unit:'i';return exports.COMPLEX(Math.cos(y)*(Math.exp(x)-Math.exp(-x))/2,Math.sin(y)*(Math.exp(x)+Math.exp(-x))/2,unit);};exports.IMSQRT=function(inumber){var x=exports.IMREAL(inumber);var y=exports.IMAGINARY(inumber);if(utils.anyIsError(x,y)){return error.value;}
var unit=inumber.substring(inumber.length-1);unit=(unit==='i'||unit==='j')?unit:'i';var s=Math.sqrt(exports.IMABS(inumber));var t=exports.IMARGUMENT(inumber);return exports.COMPLEX(s*Math.cos(t/2),s*Math.sin(t/2),unit);};exports.IMCSC=function(inumber){if(inumber===true||inumber===false){return error.value;}
var x=exports.IMREAL(inumber);var y=exports.IMAGINARY(inumber);if(utils.anyIsError(x,y)){return error.num;}
return exports.IMDIV('1',exports.IMSIN(inumber));};exports.IMCSCH=function(inumber){if(inumber===true||inumber===false){return error.value;}
var x=exports.IMREAL(inumber);var y=exports.IMAGINARY(inumber);if(utils.anyIsError(x,y)){return error.num;}
return exports.IMDIV('1',exports.IMSINH(inumber));};exports.IMSUB=function(inumber1,inumber2){var a=this.IMREAL(inumber1);var b=this.IMAGINARY(inumber1);var c=this.IMREAL(inumber2);var d=this.IMAGINARY(inumber2);if(utils.anyIsError(a,b,c,d)){return error.value;}
var unit1=inumber1.substring(inumber1.length-1);var unit2=inumber2.substring(inumber2.length-1);var unit='i';if(unit1==='j'){unit='j';}else if(unit2==='j'){unit='j';}
return this.COMPLEX(a-c,b-d,unit);};exports.IMSUM=function(){var args=utils.flatten(arguments);var result=args[0];for(var i=1;i<args.length;i++){var a=this.IMREAL(result);var b=this.IMAGINARY(result);var c=this.IMREAL(args[i]);var d=this.IMAGINARY(args[i]);if(utils.anyIsError(a,b,c,d)){return error.value;}
result=this.COMPLEX(a+c,b+d);}
return result;};exports.IMTAN=function(inumber){if(inumber===true||inumber===false){return error.value;}
var x=exports.IMREAL(inumber);var y=exports.IMAGINARY(inumber);if(utils.anyIsError(x,y)){return error.value;}
return this.IMDIV(this.IMSIN(inumber),this.IMCOS(inumber));};exports.OCT2BIN=function(number,places){if(!/^[0-7]{1,10}$/.test(number)){return error.num;}
var negative=(number.length===10&&number.substring(0,1)==='7')?true:false;var decimal=(negative)?parseInt(number,8)-1073741824:parseInt(number,8);if(decimal<-512||decimal>511){return error.num;}
if(negative){return '1'+REPT('0',9-(512+decimal).toString(2).length)+(512+decimal).toString(2);}
var result=decimal.toString(2);if(typeof places==='undefined'){return result;}else{if(isNaN(places)){return error.value;}
if(places<0){return error.num;}
places=Math.floor(places);return(places>=result.length)?REPT('0',places-result.length)+result:error.num;}};exports.OCT2DEC=function(number){if(!/^[0-7]{1,10}$/.test(number)){return error.num;}
var decimal=parseInt(number,8);return(decimal>=536870912)?decimal-1073741824:decimal;};exports.OCT2HEX=function(number,places){if(!/^[0-7]{1,10}$/.test(number)){return error.num;}
var decimal=parseInt(number,8);if(decimal>=536870912){return 'ff'+(decimal+3221225472).toString(16);}
var result=decimal.toString(16);if(places===undefined){return result;}else{if(isNaN(places)){return error.value;}
if(places<0){return error.num;}
places=Math.floor(places);return(places>=result.length)?REPT('0',places-result.length)+result:error.num;}};return exports;})();met.financial=(function(){var exports={};function validDate(d){return d&&d.getTime&&!isNaN(d.getTime());}
function ensureDate(d){return(d instanceof Date)?d:new Date(d);}
exports.ACCRINT=function(issue,first,settlement,rate,par,frequency,basis){issue=ensureDate(issue);first=ensureDate(first);settlement=ensureDate(settlement);if(!validDate(issue)||!validDate(first)||!validDate(settlement)){return '#VALUE!';}
if(rate<=0||par<=0){return '#NUM!';}
if([1,2,4].indexOf(frequency)===-1){return '#NUM!';}
if([0,1,2,3,4].indexOf(basis)===-1){return '#NUM!';}
if(settlement<=issue){return '#NUM!';}
par=par||0;basis=basis||0;return par*rate*YEARFRAC(issue,settlement,basis);};exports.ACCRINTM=null;exports.AMORDEGRC=null;exports.AMORLINC=null;exports.COUPDAYBS=null;exports.COUPDAYS=null;exports.COUPDAYSNC=null;exports.COUPNCD=null;exports.COUPNUM=null;exports.COUPPCD=null;exports.CUMIPMT=function(rate,periods,value,start,end,type){rate=utils.parseNumber(rate);periods=utils.parseNumber(periods);value=utils.parseNumber(value);if(utils.anyIsError(rate,periods,value)){return error.value;}
if(rate<=0||periods<=0||value<=0){return error.num;}
if(start<1||end<1||start>end){return error.num;}
if(type!==0&&type!==1){return error.num;}
var payment=exports.PMT(rate,periods,value,0,type);var interest=0;if(start===1){if(type===0){interest=-value;start++;}}
for(var i=start;i<=end;i++){if(type===1){interest+=exports.FV(rate,i-2,payment,value,1)-payment;}else{interest+=exports.FV(rate,i-1,payment,value,0);}}
interest*=rate;return interest;};exports.CUMPRINC=function(rate,periods,value,start,end,type){rate=utils.parseNumber(rate);periods=utils.parseNumber(periods);value=utils.parseNumber(value);if(utils.anyIsError(rate,periods,value)){return error.value;}
if(rate<=0||periods<=0||value<=0){return error.num;}
if(start<1||end<1||start>end){return error.num;}
if(type!==0&&type!==1){return error.num;}
var payment=exports.PMT(rate,periods,value,0,type);var principal=0;if(start===1){if(type===0){principal=payment+value*rate;}else{principal=payment;}
start++;}
for(var i=start;i<=end;i++){if(type>0){principal+=payment-(exports.FV(rate,i-2,payment,value,1)-payment)*rate;}else{principal+=payment-exports.FV(rate,i-1,payment,value,0)*rate;}}
return principal;};exports.DB=function(cost,salvage,life,period,month){month=(month===undefined)?12:month;cost=utils.parseNumber(cost);salvage=utils.parseNumber(salvage);life=utils.parseNumber(life);period=utils.parseNumber(period);month=utils.parseNumber(month);if(utils.anyIsError(cost,salvage,life,period,month)){return error.value;}
if(cost<0||salvage<0||life<0||period<0){return error.num;}
if([1,2,3,4,5,6,7,8,9,10,11,12].indexOf(month)===-1){return error.num;}
if(period>life){return error.num;}
if(salvage>=cost){return 0;}
var rate=(1-Math.pow(salvage/cost,1/life)).toFixed(3);var initial=cost*rate*month/12;var total=initial;var current=0;var ceiling=(period===life)?life-1:period;for(var i=2;i<=ceiling;i++){current=(cost-total)*rate;total+=current;}
if(period===1){return initial;}else if(period===life){return(cost-total)*rate;}else{return current;}};exports.DDB=function(cost,salvage,life,period,factor){factor=(factor===undefined)?2:factor;cost=utils.parseNumber(cost);salvage=utils.parseNumber(salvage);life=utils.parseNumber(life);period=utils.parseNumber(period);factor=utils.parseNumber(factor);if(utils.anyIsError(cost,salvage,life,period,factor)){return error.value;}
if(cost<0||salvage<0||life<0||period<0||factor<=0){return error.num;}
if(period>life){return error.num;}
if(salvage>=cost){return 0;}
var total=0;var current=0;for(var i=1;i<=period;i++){current=Math.min((cost-total)*(factor/life),(cost-salvage-total));total+=current;}
return current;};exports.DISC=null;exports.DOLLARDE=function(dollar,fraction){dollar=utils.parseNumber(dollar);fraction=utils.parseNumber(fraction);if(utils.anyIsError(dollar,fraction)){return error.value;}
if(fraction<0){return error.num;}
if(fraction>=0&&fraction<1){return error.div0;}
fraction=parseInt(fraction,10);var result=parseInt(dollar,10);result+=(dollar%1)*Math.pow(10,Math.ceil(Math.log(fraction)/Math.LN10))/fraction;var power=Math.pow(10,Math.ceil(Math.log(fraction)/Math.LN2)+1);result=Math.round(result*power)/power;return result;};exports.DOLLARFR=function(dollar,fraction){dollar=utils.parseNumber(dollar);fraction=utils.parseNumber(fraction);if(utils.anyIsError(dollar,fraction)){return error.value;}
if(fraction<0){return error.num;}
if(fraction>=0&&fraction<1){return error.div0;}
fraction=parseInt(fraction,10);var result=parseInt(dollar,10);result+=(dollar%1)*Math.pow(10,-Math.ceil(Math.log(fraction)/Math.LN10))*fraction;return result;};exports.DURATION=null;exports.EFFECT=function(rate,periods){rate=utils.parseNumber(rate);periods=utils.parseNumber(periods);if(utils.anyIsError(rate,periods)){return error.value;}
if(rate<=0||periods<1){return error.num;}
periods=parseInt(periods,10);return Math.pow(1+rate/periods,periods)-1;};exports.FV=function(rate,periods,payment,value,type){value=value||0;type=type||0;rate=utils.parseNumber(rate);periods=utils.parseNumber(periods);payment=utils.parseNumber(payment);value=utils.parseNumber(value);type=utils.parseNumber(type);if(utils.anyIsError(rate,periods,payment,value,type)){return error.value;}
var result;if(rate===0){result=value+payment*periods;}else{var term=Math.pow(1+rate,periods);if(type===1){result=value*term+payment*(1+rate)*(term-1)/rate;}else{result=value*term+payment*(term-1)/rate;}}
return-result;};exports.FVSCHEDULE=function(principal,schedule){principal=utils.parseNumber(principal);schedule=utils.parseNumberArray(utils.flatten(schedule));if(utils.anyIsError(principal,schedule)){return error.value;}
var n=schedule.length;var future=principal;for(var i=0;i<n;i++){future*=1+schedule[i];}
return future;};exports.INTRATE=null;exports.IPMT=function(rate,period,periods,present,future,type){future=future||0;type=type||0;rate=utils.parseNumber(rate);period=utils.parseNumber(period);periods=utils.parseNumber(periods);present=utils.parseNumber(present);future=utils.parseNumber(future);type=utils.parseNumber(type);if(utils.anyIsError(rate,period,periods,present,future,type)){return error.value;}
var payment=exports.PMT(rate,periods,present,future,type);var interest;if(period===1){if(type===1){interest=0;}else{interest=-present;}}else{if(type===1){interest=exports.FV(rate,period-2,payment,present,1)-payment;}else{interest=exports.FV(rate,period-1,payment,present,0);}}
return interest*rate;};exports.IRR=function(values,guess){guess=guess||0;values=utils.parseNumberArray(utils.flatten(values));guess=utils.parseNumber(guess);if(utils.anyIsError(values,guess)){return error.value;}
var irrResult=function(values,dates,rate){var r=rate+1;var result=values[0];for(var i=1;i<values.length;i++){result+=values[i]/Math.pow(r,(dates[i]-dates[0])/365);}
return result;};var irrResultDeriv=function(values,dates,rate){var r=rate+1;var result=0;for(var i=1;i<values.length;i++){var frac=(dates[i]-dates[0])/365;result-=frac*values[i]/Math.pow(r,frac+1);}
return result;};var dates=[];var positive=false;var negative=false;for(var i=0;i<values.length;i++){dates[i]=(i===0)?0:dates[i-1]+365;if(values[i]>0){positive=true;}
if(values[i]<0){negative=true;}}
if(!positive||!negative){return error.num;}
guess=(guess===undefined)?0.1:guess;var resultRate=guess;var epsMax=1e-10;var newRate,epsRate,resultValue;var contLoop=true;do{resultValue=irrResult(values,dates,resultRate);newRate=resultRate-resultValue/irrResultDeriv(values,dates,resultRate);epsRate=Math.abs(newRate-resultRate);resultRate=newRate;contLoop=(epsRate>epsMax)&&(Math.abs(resultValue)>epsMax);}while(contLoop);return resultRate;};exports.ISPMT=function(rate,period,periods,value){rate=utils.parseNumber(rate);period=utils.parseNumber(period);periods=utils.parseNumber(periods);value=utils.parseNumber(value);if(utils.anyIsError(rate,period,periods,value)){return error.value;}
return value*rate*(period/periods-1);};exports.MDURATION=null;exports.MIRR=function(values,finance_rate,reinvest_rate){values=utils.parseNumberArray(utils.flatten(values));finance_rate=utils.parseNumber(finance_rate);reinvest_rate=utils.parseNumber(reinvest_rate);if(utils.anyIsError(values,finance_rate,reinvest_rate)){return error.value;}
var n=values.length;var payments=[];var incomes=[];for(var i=0;i<n;i++){if(values[i]<0){payments.push(values[i]);}else{incomes.push(values[i]);}}
var num=-exports.NPV(reinvest_rate,incomes)*Math.pow(1+reinvest_rate,n-1);var den=exports.NPV(finance_rate,payments)*(1+finance_rate);return Math.pow(num/den,1/(n-1))-1;};exports.NOMINAL=function(rate,periods){rate=utils.parseNumber(rate);periods=utils.parseNumber(periods);if(utils.anyIsError(rate,periods)){return error.value;}
if(rate<=0||periods<1){return error.num;}
periods=parseInt(periods,10);return(Math.pow(rate+1,1/periods)-1)*periods;};exports.NPER=function(rate,payment,present,future,type){type=(type===undefined)?0:type;future=(future===undefined)?0:future;rate=utils.parseNumber(rate);payment=utils.parseNumber(payment);present=utils.parseNumber(present);future=utils.parseNumber(future);type=utils.parseNumber(type);if(utils.anyIsError(rate,payment,present,future,type)){return error.value;}
var num=payment*(1+rate*type)-future*rate;var den=(present*rate+payment*(1+rate*type));return Math.log(num/den)/Math.log(1+rate);};exports.NPV=function(){var args=utils.parseNumberArray(utils.flatten(arguments));if(args instanceof Error){return args;}
var rate=args[0];var value=0;for(var j=1;j<args.length;j++){value+=args[j]/Math.pow(1+rate,j);}
return value;};exports.ODDFPRICE=null;exports.ODDFYIELD=null;exports.ODDLPRICE=null;exports.ODDLYIELD=null;exports.PDURATION=function(rate,present,future){rate=utils.parseNumber(rate);present=utils.parseNumber(present);future=utils.parseNumber(future);if(utils.anyIsError(rate,present,future)){return error.value;}
if(rate<=0){return error.num;}
return(Math.log(future)-Math.log(present))/Math.log(1+rate);};exports.PMT=function(rate,periods,present,future,type){future=future||0;type=type||0;rate=utils.parseNumber(rate);periods=utils.parseNumber(periods);present=utils.parseNumber(present);future=utils.parseNumber(future);type=utils.parseNumber(type);if(utils.anyIsError(rate,periods,present,future,type)){return error.value;}
var result;if(rate===0){result=(present+future)/periods;}else{var term=Math.pow(1+rate,periods);if(type===1){result=(future*rate/(term-1)+present*rate/(1-1/term))/(1+rate);}else{result=future*rate/(term-1)+present*rate/(1-1/term);}}
return-result;};exports.PPMT=function(rate,period,periods,present,future,type){future=future||0;type=type||0;rate=utils.parseNumber(rate);periods=utils.parseNumber(periods);present=utils.parseNumber(present);future=utils.parseNumber(future);type=utils.parseNumber(type);if(utils.anyIsError(rate,periods,present,future,type)){return error.value;}
return exports.PMT(rate,periods,present,future,type)-exports.IPMT(rate,period,periods,present,future,type);};exports.PRICE=null;exports.PRICEDISC=null;exports.PRICEMAT=null;exports.PV=function(rate,periods,payment,future,type){future=future||0;type=type||0;rate=utils.parseNumber(rate);periods=utils.parseNumber(periods);payment=utils.parseNumber(payment);future=utils.parseNumber(future);type=utils.parseNumber(type);if(utils.anyIsError(rate,periods,payment,future,type)){return error.value;}
if(rate===0){return-payment*periods-future;}else{return(((1-Math.pow(1+rate,periods))/rate)*payment*(1+rate*type)-future)/Math.pow(1+rate,periods);}};exports.RATE=function(periods,payment,present,future,type,guess){guess=(guess===undefined)?0.01:guess;future=(future===undefined)?0:future;type=(type===undefined)?0:type;periods=utils.parseNumber(periods);payment=utils.parseNumber(payment);present=utils.parseNumber(present);future=utils.parseNumber(future);type=utils.parseNumber(type);guess=utils.parseNumber(guess);if(utils.anyIsError(periods,payment,present,future,type,guess)){return error.value;}
var epsMax=1e-6;var iterMax=100;var iter=0;var close=false;var rate=guess;while(iter<iterMax&&!close){var t1=Math.pow(rate+1,periods);var t2=Math.pow(rate+1,periods-1);var f1=future+t1*present+payment*(t1-1)*(rate*type+1)/rate;var f2=periods*t2*present-payment*(t1-1)*(rate*type+1)/Math.pow(rate,2);var f3=periods*payment*t2*(rate*type+1)/rate+payment*(t1-1)*type/rate;var newRate=rate-f1/(f2+f3);if(Math.abs(newRate-rate)<epsMax)close=true;iter++
rate=newRate;}
if(!close)return Number.NaN+rate;return rate;};exports.RECEIVED=null;exports.RRI=function(periods,present,future){periods=utils.parseNumber(periods);present=utils.parseNumber(present);future=utils.parseNumber(future);if(utils.anyIsError(periods,present,future)){return error.value;}
if(periods===0||present===0){return error.num;}
return Math.pow(future/present,1/periods)-1;};exports.SLN=function(cost,salvage,life){cost=utils.parseNumber(cost);salvage=utils.parseNumber(salvage);life=utils.parseNumber(life);if(utils.anyIsError(cost,salvage,life)){return error.value;}
if(life===0){return error.num;}
return(cost-salvage)/life;};exports.SYD=function(cost,salvage,life,period){cost=utils.parseNumber(cost);salvage=utils.parseNumber(salvage);life=utils.parseNumber(life);period=utils.parseNumber(period);if(utils.anyIsError(cost,salvage,life,period)){return error.value;}
if(life===0){return error.num;}
if(period<1||period>life){return error.num;}
period=parseInt(period,10);return((cost-salvage)*(life-period+1)*2)/(life*(life+1));};exports.TBILLEQ=function(settlement,maturity,discount){settlement=utils.parseDate(settlement);maturity=utils.parseDate(maturity);discount=utils.parseNumber(discount);if(utils.anyIsError(settlement,maturity,discount)){return error.value;}
if(discount<=0){return error.num;}
if(settlement>maturity){return error.num;}
if(maturity-settlement>365*24*60*60*1000){return error.num;}
return(365*discount)/(360-discount*DAYS360(settlement,maturity,false));};exports.TBILLPRICE=function(settlement,maturity,discount){settlement=utils.parseDate(settlement);maturity=utils.parseDate(maturity);discount=utils.parseNumber(discount);if(utils.anyIsError(settlement,maturity,discount)){return error.value;}
if(discount<=0){return error.num;}
if(settlement>maturity){return error.num;}
if(maturity-settlement>365*24*60*60*1000){return error.num;}
return 100*(1-discount*DAYS360(settlement,maturity,false)/360);};exports.TBILLYIELD=function(settlement,maturity,price){settlement=utils.parseDate(settlement);maturity=utils.parseDate(maturity);price=utils.parseNumber(price);if(utils.anyIsError(settlement,maturity,price)){return error.value;}
if(price<=0){return error.num;}
if(settlement>maturity){return error.num;}
if(maturity-settlement>365*24*60*60*1000){return error.num;}
return(100-price)*360/(price*DAYS360(settlement,maturity,false));};exports.VDB=null;exports.XIRR=function(values,dates,guess){values=utils.parseNumberArray(utils.flatten(values));dates=utils.parseDateArray(utils.flatten(dates));guess=utils.parseNumber(guess);if(utils.anyIsError(values,dates,guess)){return error.value;}
var irrResult=function(values,dates,rate){var r=rate+1;var result=values[0];for(var i=1;i<values.length;i++){result+=values[i]/Math.pow(r,DAYS(dates[i],dates[0])/365);}
return result;};var irrResultDeriv=function(values,dates,rate){var r=rate+1;var result=0;for(var i=1;i<values.length;i++){var frac=DAYS(dates[i],dates[0])/365;result-=frac*values[i]/Math.pow(r,frac+1);}
return result;};var positive=false;var negative=false;for(var i=0;i<values.length;i++){if(values[i]>0){positive=true;}
if(values[i]<0){negative=true;}}
if(!positive||!negative){return error.num;}
guess=guess||0.1;var resultRate=guess;var epsMax=1e-10;var newRate,epsRate,resultValue;var contLoop=true;do{resultValue=irrResult(values,dates,resultRate);newRate=resultRate-resultValue/irrResultDeriv(values,dates,resultRate);epsRate=Math.abs(newRate-resultRate);resultRate=newRate;contLoop=(epsRate>epsMax)&&(Math.abs(resultValue)>epsMax);}while(contLoop);return resultRate;};exports.XNPV=function(rate,values,dates){rate=utils.parseNumber(rate);values=utils.parseNumberArray(utils.flatten(values));dates=utils.parseDateArray(utils.flatten(dates));if(utils.anyIsError(rate,values,dates)){return error.value;}
var result=0;for(var i=0;i<values.length;i++){result+=values[i]/Math.pow(1+rate,DAYS(dates[i],dates[0])/365);}
return result;};exports.YIELD=null;exports.YIELDDISC=null;exports.YIELDMAT=null;return exports;})();met.information=(function(){var exports={};exports.CELL=null;exports.ERROR={};exports.ERROR.TYPE=function(error_val){switch(error_val){case error.nil:return 1;case error.div0:return 2;case error.value:return 3;case error.ref:return 4;case error.name:return 5;case error.num:return 6;case error.na:return 7;case error.data:return 8;}
return error.na;};exports.INFO=null;exports.ISBLANK=function(value){return value===null;};exports.ISBINARY=function(number){return(/^[01]{1,10}$/).test(number);};exports.ISERR=function(value){return([error.value,error.ref,error.div0,error.num,error.name,error.nil]).indexOf(value)>=0||(typeof value==='number'&&(isNaN(value)||!isFinite(value)));};exports.ISERROR=function(value){return exports.ISERR(value)||value===error.na;};exports.ISEVEN=function(number){return(Math.floor(Math.abs(number))&1)?false:true;};exports.ISFORMULA=null;exports.ISLOGICAL=function(value){return value===true||value===false;};exports.ISNA=function(value){return value===error.na;};exports.ISNONTEXT=function(value){return typeof(value)!=='string';};exports.ISNUMBER=function(value){return typeof(value)==='number'&&!isNaN(value)&&isFinite(value);};exports.ISODD=function(number){return(Math.floor(Math.abs(number))&1)?true:false;};exports.ISREF=null;exports.ISTEXT=function(value){return typeof(value)==='string';};exports.N=function(value){if(this.ISNUMBER(value)){return value;}
if(value instanceof Date){return value.getTime();}
if(value===true){return 1;}
if(value===false){return 0;}
if(this.ISERROR(value)){return value;}
return 0;};exports.NA=function(){return error.na;};exports.SHEET=null;exports.SHEETS=null;exports.TYPE=function(value){if(this.ISNUMBER(value)){return 1;}
if(this.ISTEXT(value)){return 2;}
if(this.ISLOGICAL(value)){return 4;}
if(this.ISERROR(value)){return 16;}
if(Array.isArray(value)){return 64;}};return exports;})();met.logical=(function(){var exports={};exports.AND=function(){var args=utils.flatten(arguments);var result=true;for(var i=0;i<args.length;i++){if(!args[i]){result=false;}}
return result;};exports.CHOOSE=function(){if(arguments.length<2){return error.na;}
var index=arguments[0];if(index<1||index>254){return error.value;}
if(arguments.length<index+1){return error.value;}
return arguments[index];};exports.FALSE=function(){return false;};exports.IF=function(test,then_value,otherwise_value){return test?then_value:otherwise_value;};exports.IFERROR=function(value,valueIfError){if(ISERROR(value)){return valueIfError;}
return value;};exports.IFNA=function(value,value_if_na){return value===error.na?value_if_na:value;};exports.NOT=function(logical){return!logical;};exports.OR=function(){var args=utils.flatten(arguments);var result=false;for(var i=0;i<args.length;i++){if(args[i]){result=true;}}
return result;};exports.TRUE=function(){return true;};exports.XOR=function(){var args=utils.flatten(arguments);var result=0;for(var i=0;i<args.length;i++){if(args[i]){result++;}}
return(Math.floor(Math.abs(result))&1)?true:false;};exports.SWITCH=function(){var result;if(arguments.length>0){var targetValue=arguments[0];var argc=arguments.length-1;var switchCount=Math.floor(argc/2);var switchSatisfied=false;var defaultClause=argc%2===0?null:arguments[arguments.length-1];if(switchCount){for(var index=0;index<switchCount;index++){if(targetValue===arguments[index*2+1]){result=arguments[index*2+2];switchSatisfied=true;break;}}}
if(!switchSatisfied&&defaultClause){result=defaultClause;}}
return result;};return exports;})();met.math=(function(){var exports={};exports.ABS=function(number){number=utils.parseNumber(number);if(number instanceof Error){return number;}
return Math.abs(utils.parseNumber(number));};exports.ACOS=function(number){number=utils.parseNumber(number);if(number instanceof Error){return number;}
return Math.acos(number);};exports.ACOSH=function(number){number=utils.parseNumber(number);if(number instanceof Error){return number;}
return Math.log(number+Math.sqrt(number*number-1));};exports.ACOT=function(number){number=utils.parseNumber(number);if(number instanceof Error){return number;}
return Math.atan(1/number);};exports.ACOTH=function(number){number=utils.parseNumber(number);if(number instanceof Error){return number;}
return 0.5*Math.log((number+1)/(number-1));};exports.AGGREGATE=null
exports.ARABIC=function(text){if(!/^M*(?:D?C{0,3}|C[MD])(?:L?X{0,3}|X[CL])(?:V?I{0,3}|I[XV])$/.test(text)){return error.value;}
var r=0;text.replace(/[MDLV]|C[MD]?|X[CL]?|I[XV]?/g,function(i){r+={M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1}[i];});return r;};exports.ASIN=function(number){number=utils.parseNumber(number);if(number instanceof Error){return number;}
return Math.asin(number);};exports.ASINH=function(number){number=utils.parseNumber(number);if(number instanceof Error){return number;}
return Math.log(number+Math.sqrt(number*number+1));};exports.ATAN=function(number){number=utils.parseNumber(number);if(number instanceof Error){return number;}
return Math.atan(number);};exports.ATAN2=function(number_x,number_y){number_x=utils.parseNumber(number_x);number_y=utils.parseNumber(number_y);if(utils.anyIsError(number_x,number_y)){return error.value;}
return Math.atan2(number_x,number_y);};exports.ATANH=function(number){number=utils.parseNumber(number);if(number instanceof Error){return number;}
return Math.log((1+number)/(1-number))/2;};exports.BASE=function(number,radix,min_length){min_length=min_length||0;number=utils.parseNumber(number);radix=utils.parseNumber(radix);min_length=utils.parseNumber(min_length);if(utils.anyIsError(number,radix,min_length)){return error.value;}
min_length=(min_length===undefined)?0:min_length;var result=number.toString(radix);return new Array(Math.max(min_length+1-result.length,0)).join('0')+result;};exports.CEILING=function(number,significance,mode){significance=(significance===undefined)?1:significance;mode=(mode===undefined)?0:mode;number=utils.parseNumber(number);significance=utils.parseNumber(significance);mode=utils.parseNumber(mode);if(utils.anyIsError(number,significance,mode)){return error.value;}
if(significance===0){return 0;}
significance=Math.abs(significance);if(number>=0){return Math.ceil(number/significance)*significance;}else{if(mode===0){return-1*Math.floor(Math.abs(number)/significance)*significance;}else{return-1*Math.ceil(Math.abs(number)/significance)*significance;}}};exports.CEILING.MATH=exports.CEILING;exports.CEILING.PRECISE=exports.CEILING;exports.COMBIN=function(number,number_chosen){number=utils.parseNumber(number);number_chosen=utils.parseNumber(number_chosen);if(utils.anyIsError(number,number_chosen)){return error.value;}
return exports.FACT(number)/(exports.FACT(number_chosen)*exports.FACT(number-number_chosen));};exports.COMBINA=function(number,number_chosen){number=utils.parseNumber(number);number_chosen=utils.parseNumber(number_chosen);if(utils.anyIsError(number,number_chosen)){return error.value;}
return(number===0&&number_chosen===0)?1:exports.COMBIN(number+number_chosen-1,number-1);};exports.COS=function(number){number=utils.parseNumber(number);if(number instanceof Error){return number;}
return Math.cos(number);};exports.COSH=function(number){number=utils.parseNumber(number);if(number instanceof Error){return number;}
return(Math.exp(number)+Math.exp(-number))/2;};exports.COT=function(number){number=utils.parseNumber(number);if(number instanceof Error){return number;}
return 1/Math.tan(number);};exports.COTH=function(number){number=utils.parseNumber(number);if(number instanceof Error){return number;}
var e2=Math.exp(2*number);return(e2+1)/(e2-1);};exports.CSC=function(number){number=utils.parseNumber(number);if(number instanceof Error){return number;}
return 1/Math.sin(number);};exports.CSCH=function(number){number=utils.parseNumber(number);if(number instanceof Error){return number;}
return 2/(Math.exp(number)-Math.exp(-number));};exports.DECIMAL=function(number,radix){if(arguments.length<1){return error.value;}
return parseInt(number,radix);};exports.DEGREES=function(number){number=utils.parseNumber(number);if(number instanceof Error){return number;}
return number*180/Math.PI;};exports.EVEN=function(number){number=utils.parseNumber(number);if(number instanceof Error){return number;}
return exports.CEILING(number,-2,-1);};exports.EXP=Math.exp;var MEMOIZED_FACT=[];exports.FACT=function(number){number=utils.parseNumber(number);if(number instanceof Error){return number;}
var n=Math.floor(number);if(n===0||n===1){return 1;}else if(MEMOIZED_FACT[n]>0){return MEMOIZED_FACT[n];}else{MEMOIZED_FACT[n]=exports.FACT(n-1)*n;return MEMOIZED_FACT[n];}};exports.FACTDOUBLE=function(number){number=utils.parseNumber(number);if(number instanceof Error){return number;}
var n=Math.floor(number);if(n<=0){return 1;}else{return n*exports.FACTDOUBLE(n-2);}};exports.FLOOR=function(number,significance,mode){significance=(significance===undefined)?1:significance;mode=(mode===undefined)?0:mode;number=utils.parseNumber(number);significance=utils.parseNumber(significance);mode=utils.parseNumber(mode);if(utils.anyIsError(number,significance,mode)){return error.value;}
if(significance===0){return 0;}
significance=Math.abs(significance);if(number>=0){return Math.floor(number/significance)*significance;}else{if(mode===0){return-1*Math.ceil(Math.abs(number)/significance)*significance;}else{return-1*Math.floor(Math.abs(number)/significance)*significance;}}};exports.FLOOR.MATH=exports.FLOOR;exports.GCD=null;exports.INT=function(number){number=utils.parseNumber(number);if(number instanceof Error){return number;}
return Math.floor(number);};exports.LCM=function(){var o=utils.parseNumberArray(utils.flatten(arguments));if(o instanceof Error){return o;}
for(var i,j,n,d,r=1;(n=o.pop())!==undefined;){while(n>1){if(n%2){for(i=3,j=Math.floor(Math.sqrt(n));i<=j&&n%i;i+=2){}
d=(i<=j)?i:n;}else{d=2;}
for(n/=d,r*=d,i=o.length;i;(o[--i]%d)===0&&(o[i]/=d)===1&&o.splice(i,1)){}}}
return r;};exports.LN=function(number){number=utils.parseNumber(number);if(number instanceof Error){return number;}
return Math.log(number);};exports.LOG=function(number,base){number=utils.parseNumber(number);base=(base===undefined)?10:utils.parseNumber(base);if(utils.anyIsError(number,base)){return error.value;}
return Math.log(number)/Math.log(base);};exports.LOG10=function(number){number=utils.parseNumber(number);if(number instanceof Error){return number;}
return Math.log(number)/Math.log(10);};exports.MDETERM=null;exports.MINVERSE=null;exports.MMULT=null;exports.MOD=function(dividend,divisor){dividend=utils.parseNumber(dividend);divisor=utils.parseNumber(divisor);if(utils.anyIsError(dividend,divisor)){return error.value;}
if(divisor===0){return error.div0;}
var modulus=Math.abs(dividend%divisor);return(divisor>0)?modulus:-modulus;};exports.MROUND=function(number,multiple){number=utils.parseNumber(number);multiple=utils.parseNumber(multiple);if(utils.anyIsError(number,multiple)){return error.value;}
if(number*multiple<0){return error.num;}
return Math.round(number/multiple)*multiple;};exports.MULTINOMIAL=function(){var args=utils.parseNumberArray(utils.flatten(arguments));if(args instanceof Error){return args;}
var sum=0;var divisor=1;for(var i=0;i<args.length;i++){sum+=args[i];divisor*=exports.FACT(args[i]);}
return exports.FACT(sum)/divisor;};exports.MUNIT=null;exports.ODD=function(number){number=utils.parseNumber(number);if(number instanceof Error){return number;}
var temp=Math.ceil(Math.abs(number));temp=(temp&1)?temp:temp+1;return(number>0)?temp:-temp;};exports.PI=function(){return Math.PI;};exports.POWER=function(number,power){number=utils.parseNumber(number);power=utils.parseNumber(power);if(utils.anyIsError(number,power)){return error.value;}
var result=Math.pow(number,power);if(isNaN(result)){return error.num;}
return result;};exports.PRODUCT=function(){var args=utils.parseNumberArray(utils.flatten(arguments));if(args instanceof Error){return args;}
var result=1;for(var i=0;i<args.length;i++){result*=args[i];}
return result;};exports.QUOTIENT=function(numerator,denominator){numerator=utils.parseNumber(numerator);denominator=utils.parseNumber(denominator);if(utils.anyIsError(numerator,denominator)){return error.value;}
return parseInt(numerator/denominator,10);};exports.RADIANS=function(number){number=utils.parseNumber(number);if(number instanceof Error){return number;}
return number*Math.PI/180;};exports.RAND=function(){return Math.random();};exports.RANDBETWEEN=function(bottom,top){bottom=utils.parseNumber(bottom);top=utils.parseNumber(top);if(utils.anyIsError(bottom,top)){return error.value;}
return bottom+Math.ceil((top-bottom+1)*Math.random())-1;};exports.ROMAN=null;exports.ROUND=function(number,digits){number=utils.parseNumber(number);digits=utils.parseNumber(digits);if(utils.anyIsError(number,digits)){return error.value;}
return Math.round(number*Math.pow(10,digits))/Math.pow(10,digits);};exports.ROUNDDOWN=function(number,digits){number=utils.parseNumber(number);digits=utils.parseNumber(digits);if(utils.anyIsError(number,digits)){return error.value;}
var sign=(number>0)?1:-1;return sign*(Math.floor(Math.abs(number)*Math.pow(10,digits)))/Math.pow(10,digits);};exports.ROUNDUP=function(number,digits){number=utils.parseNumber(number);digits=utils.parseNumber(digits);if(utils.anyIsError(number,digits)){return error.value;}
var sign=(number>0)?1:-1;return sign*(Math.ceil(Math.abs(number)*Math.pow(10,digits)))/Math.pow(10,digits);};exports.SEC=function(number){number=utils.parseNumber(number);if(number instanceof Error){return number;}
return 1/Math.cos(number);};exports.SECH=function(number){number=utils.parseNumber(number);if(number instanceof Error){return number;}
return 2/(Math.exp(number)+Math.exp(-number));};exports.SERIESSUM=function(x,n,m,coefficients){x=utils.parseNumber(x);n=utils.parseNumber(n);m=utils.parseNumber(m);coefficients=utils.parseNumberArray(coefficients);if(utils.anyIsError(x,n,m,coefficients)){return error.value;}
var result=coefficients[0]*Math.pow(x,n);for(var i=1;i<coefficients.length;i++){result+=coefficients[i]*Math.pow(x,n+i*m);}
return result;};exports.SIGN=function(number){number=utils.parseNumber(number);if(number instanceof Error){return number;}
if(number<0){return-1;}else if(number===0){return 0;}else{return 1;}};exports.SIN=function(number){number=utils.parseNumber(number);if(number instanceof Error){return number;}
return Math.sin(number);};exports.SINH=function(number){number=utils.parseNumber(number);if(number instanceof Error){return number;}
return(Math.exp(number)-Math.exp(-number))/2;};exports.SQRT=function(number){number=utils.parseNumber(number);if(number instanceof Error){return number;}
if(number<0){return error.num;}
return Math.sqrt(number);};exports.SQRTPI=function(number){number=utils.parseNumber(number);if(number instanceof Error){return number;}
return Math.sqrt(number*Math.PI);};exports.SUBTOTAL=null;exports.ADD=function(num1,num2){if(arguments.length!==2){return error.na;}
num1=utils.parseNumber(num1);num2=utils.parseNumber(num2);if(utils.anyIsError(num1,num2)){return error.value;}
return num1+num2;};exports.MINUS=function(num1,num2){if(arguments.length!==2){return error.na;}
num1=utils.parseNumber(num1);num2=utils.parseNumber(num2);if(utils.anyIsError(num1,num2)){return error.value;}
return num1-num2;};exports.DIVIDE=function(dividend,divisor){if(arguments.length!==2){return error.na;}
dividend=utils.parseNumber(dividend);divisor=utils.parseNumber(divisor);if(utils.anyIsError(dividend,divisor)){return error.value;}
if(divisor===0){return error.div0;}
return dividend/divisor;};exports.MULTIPLY=function(factor1,factor2){if(arguments.length!==2){return error.na;}
factor1=utils.parseNumber(factor1);factor2=utils.parseNumber(factor2);if(utils.anyIsError(factor1,factor2)){return error.value;}
return factor1*factor2;};exports.GTE=function(num1,num2){if(arguments.length!==2){return error.na;}
num1=utils.parseNumber(num1);num2=utils.parseNumber(num2);if(utils.anyIsError(num1,num2)){return error.error;}
return num1>=num2;};exports.LT=function(num1,num2){if(arguments.length!==2){return error.na;}
num1=utils.parseNumber(num1);num2=utils.parseNumber(num2);if(utils.anyIsError(num1,num2)){return error.error;}
return num1<num2;};exports.LTE=function(num1,num2){if(arguments.length!==2){return error.na;}
num1=utils.parseNumber(num1);num2=utils.parseNumber(num2);if(utils.anyIsError(num1,num2)){return error.error;}
return num1<=num2;};exports.EQ=function(value1,value2){if(arguments.length!==2){return error.na;}
return value1===value2;};exports.NE=function(value1,value2){if(arguments.length!==2){return error.na;}
return value1!==value2;};exports.POW=function(base,exponent){if(arguments.length!==2){return error.na;}
base=utils.parseNumber(base);exponent=utils.parseNumber(exponent);if(utils.anyIsError(base,exponent)){return error.error;}
return exports.POWER(base,exponent);};exports.SUM=function(){var result=0;var argsKeys=Object.keys(arguments);for(var i=0;i<argsKeys.length;++i){var elt=arguments[argsKeys[i]];if(typeof elt==='number'){result+=elt;}else if(typeof elt==='string'){var parsed=parseFloat(elt);!isNaN(parsed)&&(result+=parsed);}else if(Array.isArray(elt)){result+=exports.SUM.apply(null,elt);}}
return result;};exports.SUMIF=function(){var args=utils.argsToArray(arguments);var criteria=args.pop();var range=utils.parseNumberArray(utils.flatten(args));if(range instanceof Error){return range;}
var result=0;for(var i=0;i<range.length;i++){result+=(eval(range[i]+criteria))?range[i]:0;}
return result;};exports.SUMIFS=function(){var args=utils.argsToArray(arguments);var range=utils.parseNumberArray(utils.flatten(args.shift()));if(range instanceof Error){return range;}
var criteria=args;var n_range_elements=range.length;var n_criterias=criteria.length;var result=0;for(var i=0;i<n_range_elements;i++){var el=range[i];var condition='';for(var c=0;c<n_criterias;c+=2){if(isNaN(criteria[c][i])){condition+='"'+criteria[c][i]+'"'+criteria[c+1];}
else{condition+=criteria[c][i]+criteria[c+1];}
if(c!==n_criterias-1){condition+=' && ';}}
condition=condition.slice(0,-4)
if(eval(condition)){result+=el;}}
return result;};exports.SUMPRODUCT=null;exports.SUMSQ=function(){var numbers=utils.parseNumberArray(utils.flatten(arguments));if(numbers instanceof Error){return numbers;}
var result=0;var length=numbers.length;for(var i=0;i<length;i++){result+=(ISNUMBER(numbers[i]))?numbers[i]*numbers[i]:0;}
return result;};exports.SUMX2MY2=function(array_x,array_y){array_x=utils.parseNumberArray(utils.flatten(array_x));array_y=utils.parseNumberArray(utils.flatten(array_y));if(utils.anyIsError(array_x,array_y)){return error.value;}
var result=0;for(var i=0;i<array_x.length;i++){result+=array_x[i]*array_x[i]-array_y[i]*array_y[i];}
return result;};exports.SUMX2PY2=function(array_x,array_y){array_x=utils.parseNumberArray(utils.flatten(array_x));array_y=utils.parseNumberArray(utils.flatten(array_y));if(utils.anyIsError(array_x,array_y)){return error.value;}
var result=0;array_x=utils.parseNumberArray(utils.flatten(array_x));array_y=utils.parseNumberArray(utils.flatten(array_y));for(var i=0;i<array_x.length;i++){result+=array_x[i]*array_x[i]+array_y[i]*array_y[i];}
return result;};exports.SUMXMY2=function(array_x,array_y){array_x=utils.parseNumberArray(utils.flatten(array_x));array_y=utils.parseNumberArray(utils.flatten(array_y));if(utils.anyIsError(array_x,array_y)){return error.value;}
var result=0;array_x=utils.flatten(array_x);array_y=utils.flatten(array_y);for(var i=0;i<array_x.length;i++){result+=Math.pow(array_x[i]-array_y[i],2);}
return result;};exports.TAN=function(number){number=utils.parseNumber(number);if(number instanceof Error){return number;}
return Math.tan(number);};exports.TANH=function(number){number=utils.parseNumber(number);if(number instanceof Error){return number;}
var e2=Math.exp(2*number);return(e2-1)/(e2+1);};exports.TRUNC=function(number,digits){digits=(digits===undefined)?0:digits;number=utils.parseNumber(number);digits=utils.parseNumber(digits);if(utils.anyIsError(number,digits)){return error.value;}
var sign=(number>0)?1:-1;return sign*(Math.floor(Math.abs(number)*Math.pow(10,digits)))/Math.pow(10,digits);};return exports;})();met.misc=(function(){var exports={};exports.UNIQUE=function(){var result=[];for(var i=0;i<arguments.length;++i){var hasElement=false;var element=arguments[i];for(var j=0;j<result.length;++j){hasElement=result[j]===element;if(hasElement){break;}}
if(!hasElement){result.push(element);}}
return result;};exports.FLATTEN=utils.flatten;exports.ARGS2ARRAY=function(){return Array.prototype.slice.call(arguments,0);};exports.REFERENCE=function(context,reference){try{var path=reference.split('.');var result=context;for(var i=0;i<path.length;++i){var step=path[i];if(step[step.length-1]===']'){var opening=step.indexOf('[');var index=step.substring(opening+1,step.length-1);result=result[step.substring(0,opening)][index];}else{result=result[step];}}
return result;}catch(error){}};exports.JOIN=function(array,separator){return array.join(separator);};exports.NUMBERS=function(){var possibleNumbers=utils.flatten(arguments);return possibleNumbers.filter(function(el){return typeof el==='number';});};exports.NUMERAL=null;return exports;})();met.text=(function(){var exports={};exports.ASC=null;exports.BAHTTEXT=null;exports.CHAR=function(number){number=utils.parseNumber(number);if(number instanceof Error){return number;}
return String.fromCharCode(number);};exports.CLEAN=function(text){text=text||'';var re=/[\0-\x1F]/g;return text.replace(re,"");};exports.CODE=function(text){text=text||'';return text.charCodeAt(0);};exports.CONCATENATE=function(){var args=utils.flatten(arguments);var trueFound=0;while((trueFound=args.indexOf(true))>-1){args[trueFound]='TRUE';}
var falseFound=0;while((falseFound=args.indexOf(false))>-1){args[falseFound]='FALSE';}
return args.join('');};exports.DBCS=null;exports.DOLLAR=null;exports.EXACT=function(text1,text2){return text1===text2;};exports.FIND=function(find_text,within_text,position){position=(position===undefined)?0:position;return within_text?within_text.indexOf(find_text,position-1)+1:null;};exports.FIXED=null;exports.HTML2TEXT=function(value){var result='';if(value){if(value instanceof Array){value.forEach(function(line){if(result!==''){result+='\n';}
result+=(line.replace(/<(?:.|\n)*?>/gm,''));});}else{result=value.replace(/<(?:.|\n)*?>/gm,'');}}
return result;};exports.LEFT=function(text,number){number=(number===undefined)?1:number;number=utils.parseNumber(number);if(number instanceof Error||typeof text!=='string'){return error.value;}
return text?text.substring(0,number):null;};exports.LEN=function(text){if(arguments.length===0){return error.error;}
if(typeof text==='string'){return text?text.length:0;}
if(text.length){return text.length;}
return error.value;};exports.LOWER=function(text){if(typeof text!=='string'){return error.value;}
return text?text.toLowerCase():text;};exports.MID=function(text,start,number){start=utils.parseNumber(start);number=utils.parseNumber(number);if(utils.anyIsError(start,number)||typeof text!=='string'){return number;}
var begin=start-1;var end=begin+number;return text.substring(begin,end);};exports.NUMBERVALUE=null;exports.PRONETIC=null;exports.PROPER=function(text){if(text===undefined||text.length===0){return error.value;}
if(text===true){text='TRUE';}
if(text===false){text='FALSE';}
if(isNaN(text)&&typeof text==='number'){return error.value;}
if(typeof text==='number'){text=''+text;}
return text.replace(/\w\S*/g,function(txt){return txt.charAt(0).toUpperCase()+txt.substr(1).toLowerCase();});};exports.REGEXEXTRACT=function(text,regular_expression){var match=text.match(new RegExp(regular_expression));return match?(match[match.length>1?match.length-1:0]):null;};exports.REGEXMATCH=function(text,regular_expression,full){var match=text.match(new RegExp(regular_expression));return full?match:!!match;};exports.REGEXREPLACE=function(text,regular_expression,replacement){return text.replace(new RegExp(regular_expression),replacement);};exports.REPLACE=function(text,position,length,new_text){position=utils.parseNumber(position);length=utils.parseNumber(length);if(utils.anyIsError(position,length)||typeof text!=='string'||typeof new_text!=='string'){return error.value;}
return text.substr(0,position-1)+new_text+text.substr(position-1+length);};exports.REPT=function(text,number){number=utils.parseNumber(number);if(number instanceof Error){return number;}
return new Array(number+1).join(text);};exports.RIGHT=function(text,number){number=(number===undefined)?1:number;number=utils.parseNumber(number);if(number instanceof Error){return number;}
return text?text.substring(text.length-number):null;};exports.SEARCH=function(find_text,within_text,position){var foundAt;if(typeof find_text!=='string'||typeof within_text!=='string'){return error.value;}
position=(position===undefined)?0:position;foundAt=within_text.toLowerCase().indexOf(find_text.toLowerCase(),position-1)+1;return(foundAt===0)?error.value:foundAt;};exports.SPLIT=function(text,separator){return text.split(separator);};exports.SUBSTITUTE=function(text,old_text,new_text,occurrence){if(!text||!old_text||!new_text){return text;}else if(occurrence===undefined){return text.replace(new RegExp(old_text,'g'),new_text);}else{var index=0;var i=0;while(text.indexOf(old_text,index)>0){index=text.indexOf(old_text,index+1);i++;if(i===occurrence){return text.substring(0,index)+new_text+text.substring(index+old_text.length);}}}};exports.T=function(value){return(typeof value==="string")?value:'';};exports.TEXT=null;exports.TRIM=function(text){if(typeof text!=='string'){return error.value;}
return text.replace(/ +/g,' ').trim();};exports.UNICHAR=exports.CHAR;exports.UNICODE=exports.CODE;exports.UPPER=function(text){if(typeof text!=='string'){return error.value;}
return text.toUpperCase();};exports.VALUE=null;return exports;})();met.stats=(function(){var exports={};var SQRT2PI=2.5066282746310002;exports.AVEDEV=null;exports.AVERAGE=function(){var range=utils.numbers(utils.flatten(arguments));var n=range.length;var sum=0;var count=0;for(var i=0;i<n;i++){sum+=range[i];count+=1;}
return sum/count;};exports.AVERAGEA=function(){var range=utils.flatten(arguments);var n=range.length;var sum=0;var count=0;for(var i=0;i<n;i++){var el=range[i];if(typeof el==='number'){sum+=el;}
if(el===true){sum++;}
if(el!==null){count++;}}
return sum/count;};exports.AVERAGEIF=function(range,criteria,average_range){average_range=average_range||range;range=utils.flatten(range);average_range=utils.parseNumberArray(utils.flatten(average_range));if(average_range instanceof Error){return average_range;}
var average_count=0;var result=0;for(var i=0;i<range.length;i++){if(eval(range[i]+criteria)){result+=average_range[i];average_count++;}}
return result/average_count;};exports.AVERAGEIFS=null;exports.COUNT=function(){return utils.numbers(utils.flatten(arguments)).length;};exports.COUNTA=function(){var range=utils.flatten(arguments);return range.length-exports.COUNTBLANK(range);};exports.COUNTIN=function(range,value){var result=0;for(var i=0;i<range.length;i++){if(range[i]===value){result++;}}
return result;};exports.COUNTBLANK=function(){var range=utils.flatten(arguments);var blanks=0;var element;for(var i=0;i<range.length;i++){element=range[i];if(element===null||element===''){blanks++;}}
return blanks;};exports.COUNTIF=function(){var args=utils.argsToArray(arguments);var criteria=args.pop();var range=utils.flatten(args);if(!/[<>=!]/.test(criteria)){criteria='=="'+criteria+'"';}
var matches=0;for(var i=0;i<range.length;i++){if(typeof range[i]!=='string'){if(eval(range[i]+criteria)){matches++;}}else{if(eval('"'+range[i]+'"'+criteria)){matches++;}}}
return matches;};exports.COUNTIFS=function(){var args=utils.argsToArray(arguments);var results=new Array(utils.flatten(args[0]).length);for(var i=0;i<results.length;i++){results[i]=true;}
for(i=0;i<args.length;i+=2){var range=utils.flatten(args[i]);var criteria=args[i+1];if(!/[<>=!]/.test(criteria)){criteria='=="'+criteria+'"';}
for(var j=0;j<range.length;j++){if(typeof range[j]!=='string'){results[j]=results[j]&&eval(range[j]+criteria);}else{results[j]=results[j]&&eval('"'+range[j]+'"'+criteria);}}}
var result=0;for(i=0;i<results.length;i++){if(results[i]){result++;}}
return result;};exports.COUNTUNIQUE=function(){return UNIQUE.apply(null,utils.flatten(arguments)).length;};exports.FISHER=function(x){x=utils.parseNumber(x);if(x instanceof Error){return x;}
return Math.log((1+x)/(1-x))/2;};exports.FISHERINV=function(y){y=utils.parseNumber(y);if(y instanceof Error){return y;}
var e2y=Math.exp(2*y);return(e2y-1)/(e2y+1);};exports.FREQUENCY=function(data,bins){data=utils.parseNumberArray(utils.flatten(data));bins=utils.parseNumberArray(utils.flatten(bins));if(utils.anyIsError(data,bins)){return error.value;}
var n=data.length;var b=bins.length;var r=[];for(var i=0;i<=b;i++){r[i]=0;for(var j=0;j<n;j++){if(i===0){if(data[j]<=bins[0]){r[0]+=1;}}else if(i<b){if(data[j]>bins[i-1]&&data[j]<=bins[i]){r[i]+=1;}}else if(i===b){if(data[j]>bins[b-1]){r[b]+=1;}}}}
return r;};exports.LARGE=function(range,k){range=utils.parseNumberArray(utils.flatten(range));k=utils.parseNumber(k);if(utils.anyIsError(range,k)){return range;}
return range.sort(function(a,b){return b-a;})[k-1];};exports.MAX=function(){var range=utils.numbers(utils.flatten(arguments));return(range.length===0)?0:Math.max.apply(Math,range);};exports.MAXA=function(){var range=utils.arrayValuesToNumbers(utils.flatten(arguments));return(range.length===0)?0:Math.max.apply(Math,range);};exports.MIN=function(){var range=utils.numbers(utils.flatten(arguments));return(range.length===0)?0:Math.min.apply(Math,range);};exports.MINA=function(){var range=utils.arrayValuesToNumbers(utils.flatten(arguments));return(range.length===0)?0:Math.min.apply(Math,range);};exports.MODE={};exports.MODE.MULT=function(){var range=utils.parseNumberArray(utils.flatten(arguments));if(range instanceof Error){return range;}
var n=range.length;var count={};var maxItems=[];var max=0;var currentItem;for(var i=0;i<n;i++){currentItem=range[i];count[currentItem]=count[currentItem]?count[currentItem]+1:1;if(count[currentItem]>max){max=count[currentItem];maxItems=[];}
if(count[currentItem]===max){maxItems[maxItems.length]=currentItem;}}
return maxItems;};exports.MODE.SNGL=function(){var range=utils.parseNumberArray(utils.flatten(arguments));if(range instanceof Error){return range;}
return exports.MODE.MULT(range).sort(function(a,b){return a-b;})[0];};exports.PERCENTILE={};exports.PERCENTILE.EXC=function(array,k){array=utils.parseNumberArray(utils.flatten(array));k=utils.parseNumber(k);if(utils.anyIsError(array,k)){return error.value;}
array=array.sort(function(a,b){{return a-b;}});var n=array.length;if(k<1/(n+1)||k>1-1/(n+1)){return error.num;}
var l=k*(n+1)-1;var fl=Math.floor(l);return utils.cleanFloat((l===fl)?array[l]:array[fl]+(l-fl)*(array[fl+1]-array[fl]));};exports.PERCENTILE.INC=function(array,k){array=utils.parseNumberArray(utils.flatten(array));k=utils.parseNumber(k);if(utils.anyIsError(array,k)){return error.value;}
array=array.sort(function(a,b){return a-b;});var n=array.length;var l=k*(n-1);var fl=Math.floor(l);return utils.cleanFloat((l===fl)?array[l]:array[fl]+(l-fl)*(array[fl+1]-array[fl]));};exports.PERCENTRANK={};exports.PERCENTRANK.EXC=function(array,x,significance){significance=(significance===undefined)?3:significance;array=utils.parseNumberArray(utils.flatten(array));x=utils.parseNumber(x);significance=utils.parseNumber(significance);if(utils.anyIsError(array,x,significance)){return error.value;}
array=array.sort(function(a,b){return a-b;});var uniques=UNIQUE.apply(null,array);var n=array.length;var m=uniques.length;var power=Math.pow(10,significance);var result=0;var match=false;var i=0;while(!match&&i<m){if(x===uniques[i]){result=(array.indexOf(uniques[i])+1)/(n+1);match=true;}else if(x>=uniques[i]&&(x<uniques[i+1]||i===m-1)){result=(array.indexOf(uniques[i])+1+(x-uniques[i])/(uniques[i+1]-uniques[i]))/(n+1);match=true;}
i++;}
return Math.floor(result*power)/power;};exports.PERCENTRANK.INC=function(array,x,significance){significance=(significance===undefined)?3:significance;array=utils.parseNumberArray(utils.flatten(array));x=utils.parseNumber(x);significance=utils.parseNumber(significance);if(utils.anyIsError(array,x,significance)){return error.value;}
array=array.sort(function(a,b){return a-b;});var uniques=UNIQUE.apply(null,array);var n=array.length;var m=uniques.length;var power=Math.pow(10,significance);var result=0;var match=false;var i=0;while(!match&&i<m){if(x===uniques[i]){result=array.indexOf(uniques[i])/(n-1);match=true;}else if(x>=uniques[i]&&(x<uniques[i+1]||i===m-1)){result=(array.indexOf(uniques[i])+(x-uniques[i])/(uniques[i+1]-uniques[i]))/(n-1);match=true;}
i++;}
return Math.floor(result*power)/power;};exports.PERMUT=function(number,number_chosen){number=utils.parseNumber(number);number_chosen=utils.parseNumber(number_chosen);if(utils.anyIsError(number,number_chosen)){return error.value;}
return FACT(number)/FACT(number-number_chosen);};exports.PERMUTATIONA=function(number,number_chosen){number=utils.parseNumber(number);number_chosen=utils.parseNumber(number_chosen);if(utils.anyIsError(number,number_chosen)){return error.value;}
return Math.pow(number,number_chosen);};exports.PHI=function(x){x=utils.parseNumber(x);if(x instanceof Error){return error.value;}
return Math.exp(-0.5*x*x)/SQRT2PI;};exports.PROB=function(range,probability,lower,upper){if(lower===undefined){return 0;}
upper=(upper===undefined)?lower:upper;range=utils.parseNumberArray(utils.flatten(range));probability=utils.parseNumberArray(utils.flatten(probability));lower=utils.parseNumber(lower);upper=utils.parseNumber(upper);if(utils.anyIsError(range,probability,lower,upper)){return error.value;}
if(lower===upper){return(range.indexOf(lower)>=0)?probability[range.indexOf(lower)]:0;}
var sorted=range.sort(function(a,b){return a-b;});var n=sorted.length;var result=0;for(var i=0;i<n;i++){if(sorted[i]>=lower&&sorted[i]<=upper){result+=probability[range.indexOf(sorted[i])];}}
return result;};exports.QUARTILE={};exports.QUARTILE.EXC=function(range,quart){range=utils.parseNumberArray(utils.flatten(range));quart=utils.parseNumber(quart);if(utils.anyIsError(range,quart)){return error.value;}
switch(quart){case 1:return exports.PERCENTILE.EXC(range,0.25);case 2:return exports.PERCENTILE.EXC(range,0.5);case 3:return exports.PERCENTILE.EXC(range,0.75);default:return error.num;}};exports.QUARTILE.INC=function(range,quart){range=utils.parseNumberArray(utils.flatten(range));quart=utils.parseNumber(quart);if(utils.anyIsError(range,quart)){return error.value;}
switch(quart){case 1:return exports.PERCENTILE.INC(range,0.25);case 2:return exports.PERCENTILE.INC(range,0.5);case 3:return exports.PERCENTILE.INC(range,0.75);default:return error.num;}};exports.RANK={};exports.RANK.AVG=function(number,range,order){number=utils.parseNumber(number);range=utils.parseNumberArray(utils.flatten(range));if(utils.anyIsError(number,range)){return error.value;}
range=utils.flatten(range);order=order||false;var sort=(order)?function(a,b){return a-b;}:function(a,b){return b-a;};range=range.sort(sort);var length=range.length;var count=0;for(var i=0;i<length;i++){if(range[i]===number){count++;}}
return(count>1)?(2*range.indexOf(number)+count+1)/2:range.indexOf(number)+1;};exports.RANK.EQ=function(number,range,order){number=utils.parseNumber(number);range=utils.parseNumberArray(utils.flatten(range));if(utils.anyIsError(number,range)){return error.value;}
order=order||false;var sort=(order)?function(a,b){return a-b;}:function(a,b){return b-a;};range=range.sort(sort);return range.indexOf(number)+1;};exports.RSQ=function(data_x,data_y){data_x=utils.parseNumberArray(utils.flatten(data_x));data_y=utils.parseNumberArray(utils.flatten(data_y));if(utils.anyIsError(data_x,data_y)){return error.value;}
return Math.pow(exports.PEARSON(data_x,data_y),2);};exports.SMALL=function(range,k){range=utils.parseNumberArray(utils.flatten(range));k=utils.parseNumber(k);if(utils.anyIsError(range,k)){return range;}
return range.sort(function(a,b){return a-b;})[k-1];};exports.STANDARDIZE=function(x,mean,sd){x=utils.parseNumber(x);mean=utils.parseNumber(mean);sd=utils.parseNumber(sd);if(utils.anyIsError(x,mean,sd)){return error.value;}
return(x-mean)/sd;};exports.STDEV={};exports.STDEV.P=function(){var v=exports.VAR.P.apply(this,arguments);return Math.sqrt(v);};exports.STDEV.S=function(){var v=exports.VAR.S.apply(this,arguments);return Math.sqrt(v);};exports.STDEVA=function(){var v=exports.VARA.apply(this,arguments);return Math.sqrt(v);};exports.STDEVPA=function(){var v=exports.VARPA.apply(this,arguments);return Math.sqrt(v);};exports.VAR={};exports.VAR.P=function(){var range=utils.numbers(utils.flatten(arguments));var n=range.length;var sigma=0;var mean=exports.AVERAGE(range);for(var i=0;i<n;i++){sigma+=Math.pow(range[i]-mean,2);}
return sigma/n;};exports.VAR.S=function(){var range=utils.numbers(utils.flatten(arguments));var n=range.length;var sigma=0;var mean=exports.AVERAGE(range);for(var i=0;i<n;i++){sigma+=Math.pow(range[i]-mean,2);}
return sigma/(n-1);};exports.VARA=function(){var range=utils.flatten(arguments);var n=range.length;var sigma=0;var count=0;var mean=exports.AVERAGEA(range);for(var i=0;i<n;i++){var el=range[i];if(typeof el==='number'){sigma+=Math.pow(el-mean,2);}else if(el===true){sigma+=Math.pow(1-mean,2);}else{sigma+=Math.pow(0-mean,2);}
if(el!==null){count++;}}
return sigma/(count-1);};exports.VARPA=function(){var range=utils.flatten(arguments);var n=range.length;var sigma=0;var count=0;var mean=exports.AVERAGEA(range);for(var i=0;i<n;i++){var el=range[i];if(typeof el==='number'){sigma+=Math.pow(el-mean,2);}else if(el===true){sigma+=Math.pow(1-mean,2);}else{sigma+=Math.pow(0-mean,2);}
if(el!==null){count++;}}
return sigma/count;};exports.WEIBULL={};exports.WEIBULL.DIST=function(x,alpha,beta,cumulative){x=utils.parseNumber(x);alpha=utils.parseNumber(alpha);beta=utils.parseNumber(beta);if(utils.anyIsError(x,alpha,beta)){return error.value;}
return(cumulative)?1-Math.exp(-Math.pow(x/beta,alpha)):Math.pow(x,alpha-1)*Math.exp(-Math.pow(x/beta,alpha))*alpha/Math.pow(beta,alpha);};exports.Z={};exports.Z.TEST=function(range,x,sd){range=utils.parseNumberArray(utils.flatten(range));x=utils.parseNumber(x);if(utils.anyIsError(range,x)){return error.value;}
sd=sd||exports.STDEV.S(range);var n=range.length;return 1-exports.NORM.S.DIST((exports.AVERAGE(range)-x)/(sd/Math.sqrt(n)),true);};return exports;})();met.utils=(function(){var exports={};exports.PROGRESS=function(p,c){var color=c?c:'red';var value=p?p:'0';return '<div style="width:'+value+'%;height:4px;background-color:'+color+';margin-top:1px;"></div>';};exports.RATING=function(v){var html='<div class="jrating">';for(var i=0;i<5;i++){if(i<v){html+='<div class="jrating-selected"></div>';}else{html+='<div></div>';}}
html+='</div>';return html;}
return exports;})();for(var i=0;i<Object.keys(met).length;i++){var methods=met[Object.keys(met)[i]];var keys=Object.keys(methods);for(var j=0;j<keys.length;j++){if(!methods[keys[j]]){window[keys[j]]=function(){return keys[j]+'Not implemented';}}else if(typeof(methods[keys[j]])=='function'||typeof(methods[keys[j]])=='object'){window[keys[j]]=methods[keys[j]];window[keys[j]].toString=function(){return '#ERROR'};if(typeof(methods[keys[j]])=='object'){var tmp=Object.keys(methods[keys[j]]);for(var z=0;z<tmp.length;z++){window[keys[j]][tmp[z]].toString=function(){return '#ERROR'};}}}else{window[keys[j]]=function(){return keys[j]+'Not implemented';}}}}
var x=null;var y=null;var instance=null;window['TABLE']=function(){return instance;}
window['COLUMN']=window['COL']=function(){return parseInt(x)+1;}
window['ROW']=function(){return parseInt(y)+1;}
window['CELL']=function(){return F.getColumnNameFromCoords(x,y);}
window['VALUE']=function(col,row,processed){return instance.getValueFromCoords(parseInt(col)-1,parseInt(row)-1,processed);}
window['THISROWCELL']=function(col){return instance.getValueFromCoords(parseInt(col)-1,parseInt(y));}
var secureFormula=function(oldValue,runtime){var newValue='';var inside=0;var special=['=','!','>','<'];for(var i=0;i<oldValue.length;i++){if(oldValue[i]=='"'){if(inside==0){inside=1;}else{inside=0;}}
if(inside==1){newValue+=oldValue[i];}else{newValue+=oldValue[i].toUpperCase();if(runtime==true){if(i>0&&oldValue[i]=='='&&special.indexOf(oldValue[i-1])==-1&&special.indexOf(oldValue[i+1])==-1){newValue+='='}}}}
newValue=newValue.replace(/\^/g,'**');newValue=newValue.replace(/\<\>/g,'!=');newValue=newValue.replace(/\&/g,'+');newValue=newValue.replace(/\$/g,'');return newValue;}
var tokensUpdate=function(tokens,e){for(var index=0;index<tokens.length;index++){var f=F.getTokensFromRange(tokens[index])
e=e.replace(tokens[index],"["+f.join(',')+"]");}
return e;}
var F=function(expression,variables,i,j,obj){instance=obj;x=i
y=j;var s='';var keys=Object.keys(variables);if(keys.length){for(var i=0;i<keys.length;i++){if(keys[i].indexOf('.')==-1&&keys[i].indexOf('!')==-1){s+='var '+keys[i]+' = '+variables[keys[i]]+';\n';}else{s+=keys[i]+' = '+variables[keys[i]]+';\n';}}}
expression=expression.replace(/\$/g,'');expression=expression.replace(/\!/g,'.');expression=secureFormula(expression,true);var tokens=expression.match(/([A-Z]+[0-9]*\.)?(\$?[A-Z]+\$?[0-9]+):(\$?[A-Z]+\$?[0-9]+)?/g);if(tokens&&tokens.length){expression=tokensUpdate(tokens,expression);}
return new Function(s+'; return '+expression)();}
var getColumnName=function(i){var letter='';if(i>701){letter+=String.fromCharCode(64+parseInt(i/676));letter+=String.fromCharCode(64+parseInt((i%676)/26));}else if(i>25){letter+=String.fromCharCode(64+parseInt(i/26));}
letter+=String.fromCharCode(65+(i%26));return letter;}
F.getColumnNameFromCoords=function(x,y){return getColumnName(parseInt(x))+(parseInt(y)+1);}
F.getCoordsFromColumnName=function(columnName){var t=/^[a-zA-Z]+/.exec(columnName);if(t){var code=0;for(var i=0;i<t[0].length;i++){code+=parseInt(t[0].charCodeAt(i)-64)*Math.pow(26,(t[0].length-1-i));}
code--;if(code<0){code=0;}
var number=parseInt(/[0-9]+$/.exec(columnName))||null;if(number>0){number--;}
return[code,number];}}
F.getRangeFromTokens=function(tokens){tokens=tokens.filter(function(v){return v!='#REF!';});var d='';var t='';for(var i=0;i<tokens.length;i++){if(tokens[i].indexOf('.')>=0){d='.';}else if(tokens[i].indexOf('!')>=0){d='!';}
if(d){t=tokens[i].split(d);tokens[i]=t[1];t=t[0]+d}}
tokens.sort(function(a,b){var t1=Helpers.getCoordsFromColumnName(a);var t2=Helpers.getCoordsFromColumnName(b);if(t1[1]>t2[1]){return 1;}else if(t1[1]<t2[1]){return-1;}else{if(t1[0]>t2[0]){return 1;}else if(t1[0]<t2[0]){return-1;}else{return 0;}}});if(!tokens.length){return '#REF!';}else{return t+(tokens[0]+':'+tokens[tokens.length-1]);}}
F.getTokensFromRange=function(range){if(range.indexOf('.')>0){var t=range.split('.');range=t[1];t=t[0]+'.';}else if(range.indexOf('!')>0){var t=range.split('!');range=t[1];t=t[0]+'!';}else{var t='';}
var range=range.split(':');var e1=F.getCoordsFromColumnName(range[0]);var e2=F.getCoordsFromColumnName(range[1]);if(e1[0]<=e2[0]){var x1=e1[0];var x2=e2[0];}else{var x1=e2[0];var x2=e1[0];}
if(e1[1]===null&&e2[1]==null){var y1=null;var y2=null;var k=Object.keys(vars);for(var i=0;i<k.length;i++){var tmp=F.getCoordsFromColumnName(k[i]);if(tmp[0]===e1[0]){if(y1===null||tmp[1]<y1){y1=tmp[1]}}
if(tmp[0]===e2[0]){if(y2===null||tmp[1]>y2){y2=tmp[1]}}}}else{if(e1[1]<=e2[1]){var y1=e1[1];var y2=e2[1];}else{var y1=e2[1];var y2=e1[1];}}
var f=[];for(var j=y1;j<=y2;j++){var line=[];for(var i=x1;i<=x2;i++){line.push(t+F.getColumnNameFromCoords(i,j));}
f.push(line);}
return f;}
F.setFormula=function(o){var k=Object.keys(o);for(var i=0;i<k.length;i++){if(typeof(o[k[i]])=='function'){window[k[i]]=o[k[i]];}}}
return F;})();if(!jSuites&&typeof(require)==='function'){var jSuites=require('jsuites');};(function(global,factory){typeof exports==='object'&&typeof module!=='undefined'?module.exports=factory():typeof define==='function'&&define.amd?define(factory):global.jspreadsheet=global.jexcel=factory();}(this,(function(){'use strict';var Version=function(){var info={title:'Jspreadsheet',version:'4.10.1',type:'CE',host:'https://bossanova.uk/jspreadsheet',license:'MIT',print:function(){return[this.title+' '+this.type+' '+this.version,this.host,this.license].join('\r\n');}}
return function(){return info;};}();var isFormula=function(value){var v=(''+value)[0];return v=='='||v=='#'?true:false;}
var getMask=function(o){if(o.format||o.mask||o.locale){var opt={};if(o.mask){opt.mask=o.mask;}else if(o.format){opt.mask=o.format;}else{opt.locale=o.locale;opt.options=o.options;}
if(o.decimal){if(!opt.options){opt.options={};}
opt.options={decimal:o.decimal};}
return opt;}
return null;}
var jexcel=(function(el,options){var obj={};obj.options={};if(!(el instanceof Element||el instanceof HTMLDocument)){console.error('Jspreadsheet: el is not a valid DOM element');return false;}else if(el.tagName=='TABLE'){if(options=jexcel.createFromTable(el,options)){var div=document.createElement('div');el.parentNode.insertBefore(div,el);el.remove();el=div;}else{console.error('Jspreadsheet: el is not a valid DOM element');return false;}}
var defaults={url:null,method:'GET',requestVariables:null,data:null,sorting:null,copyCompatibility:false,root:null,rows:[],columns:[],colHeaders:[],colWidths:[],colAlignments:[],nestedHeaders:null,defaultColWidth:50,defaultColAlign:'center',defaultRowHeight:null,minSpareRows:0,minSpareCols:0,minDimensions:[0,0],allowExport:true,includeHeadersOnDownload:false,includeHeadersOnCopy:false,columnSorting:true,columnDrag:false,columnResize:true,rowResize:false,rowDrag:true,editable:true,allowInsertRow:true,allowManualInsertRow:true,allowInsertColumn:true,allowManualInsertColumn:true,allowDeleteRow:true,allowDeletingAllRows:false,allowDeleteColumn:true,allowRenameColumn:true,allowComments:false,wordWrap:false,imageOptions:null,csv:null,csvFileName:'jspreadsheet',csvHeaders:true,csvDelimiter:',',parseTableFirstRowAsHeader:false,parseTableAutoCellType:false,selectionCopy:true,mergeCells:{},toolbar:null,search:false,pagination:false,paginationOptions:null,fullscreen:false,lazyLoading:false,loadingSpin:false,tableOverflow:false,tableHeight:'300px',tableWidth:null,textOverflow:false,meta:null,style:null,classes:null,parseFormulas:true,autoIncrement:true,autoCasting:true,secureFormulas:true,stripHTML:true,stripHTMLOnCopy:false,filters:false,footers:null,onundo:null,onredo:null,onload:null,onchange:null,oncomments:null,onbeforechange:null,onafterchanges:null,onbeforeinsertrow:null,oninsertrow:null,onbeforeinsertcolumn:null,oninsertcolumn:null,onbeforedeleterow:null,ondeleterow:null,onbeforedeletecolumn:null,ondeletecolumn:null,onmoverow:null,onmovecolumn:null,onresizerow:null,onresizecolumn:null,onsort:null,onselection:null,oncopy:null,onpaste:null,onbeforepaste:null,onmerge:null,onfocus:null,onblur:null,onchangeheader:null,oncreateeditor:null,oneditionstart:null,oneditionend:null,onchangestyle:null,onchangemeta:null,onchangepage:null,onbeforesave:null,onsave:null,onevent:null,persistance:false,updateTable:null,detachForUpdates:false,freezeColumns:null,text:{noRecordsFound:'No records found',showingPage:'Showing page {0} of {1} entries',show:'Show ',search:'Search',entries:' entries',columnName:'Column name',insertANewColumnBefore:'Insert a new column before',insertANewColumnAfter:'Insert a new column after',deleteSelectedColumns:'Delete selected columns',renameThisColumn:'Rename this column',orderAscending:'Order ascending',orderDescending:'Order descending',insertANewRowBefore:'Insert a new row before',insertANewRowAfter:'Insert a new row after',deleteSelectedRows:'Delete selected rows',editComments:'Edit comments',addComments:'Add comments',comments:'Comments',clearComments:'Clear comments',copy:'Copy...',paste:'Paste...',saveAs:'Save as...',about:'About',areYouSureToDeleteTheSelectedRows:'Are you sure to delete the selected rows?',areYouSureToDeleteTheSelectedColumns:'Are you sure to delete the selected columns?',thisActionWillDestroyAnyExistingMergedCellsAreYouSure:'This action will destroy any existing merged cells. Are you sure?',thisActionWillClearYourSearchResultsAreYouSure:'This action will clear your search results. Are you sure?',thereIsAConflictWithAnotherMergedCell:'There is a conflict with another merged cell',invalidMergeProperties:'Invalid merged properties',cellAlreadyMerged:'Cell already merged',noCellsSelected:'No cells selected',},about:true,};for(var property in defaults){if(options&&options.hasOwnProperty(property)){if(property==='text'){obj.options[property]=defaults[property];for(var textKey in options[property]){if(options[property].hasOwnProperty(textKey)){obj.options[property][textKey]=options[property][textKey];}}}else{obj.options[property]=options[property];}}else{obj.options[property]=defaults[property];}}
obj.el=el;obj.corner=null;obj.contextMenu=null;obj.textarea=null;obj.ads=null;obj.content=null;obj.table=null;obj.thead=null;obj.tbody=null;obj.rows=[];obj.results=null;obj.searchInput=null;obj.toolbar=null;obj.pagination=null;obj.pageNumber=null;obj.headerContainer=null;obj.colgroupContainer=null;obj.headers=[];obj.records=[];obj.history=[];obj.formula=[];obj.colgroup=[];obj.selection=[];obj.highlighted=[];obj.selectedCell=null;obj.selectedContainer=null;obj.style=[];obj.data=null;obj.filter=null;obj.filters=[];obj.cursor=null;obj.historyIndex=-1;obj.ignoreEvents=false;obj.ignoreHistory=false;obj.edition=null;obj.hashString=null;obj.resizing=null;obj.dragging=null;if(obj.options.lazyLoading==true&&(obj.options.tableOverflow==false&&obj.options.fullscreen==false)){console.error('Jspreadsheet: The lazyloading only works when tableOverflow = yes or fullscreen = yes');obj.options.lazyLoading=false;}
obj.fullscreen=function(activate){if(activate==null){activate=!obj.options.fullscreen;}
if(obj.options.fullscreen!=activate){obj.options.fullscreen=activate;if(activate==true){el.classList.add('fullscreen');}else{el.classList.remove('fullscreen');}}}
obj.dispatch=function(event){if(!obj.ignoreEvents){if(typeof(obj.options.onevent)=='function'){var ret=obj.options.onevent.apply(this,arguments);}
if(typeof(obj.options[event])=='function'){var ret=obj.options[event].apply(this,Array.prototype.slice.call(arguments,1));}}
if(event=='onafterchanges'&&obj.options.persistance){var url=obj.options.persistance==true?obj.options.url:obj.options.persistance;var data=obj.prepareJson(arguments[2]);obj.save(url,data);}
return ret;}
obj.prepareTable=function(){var results=[];var size=obj.options.columns.length;if(obj.options.data&&typeof(obj.options.data[0])!=='undefined'){var keys=Object.keys(obj.options.data[0]);if(keys.length>size){size=keys.length;}}
if(obj.options.minDimensions[0]>size){size=obj.options.minDimensions[0];}
var multiple=[];for(var i=0;i<size;i++){if(!obj.options.colHeaders[i]){obj.options.colHeaders[i]='';}
if(!obj.options.colWidths[i]){obj.options.colWidths[i]=obj.options.defaultColWidth;}
if(!obj.options.colAlignments[i]){obj.options.colAlignments[i]=obj.options.defaultColAlign;}
if(!obj.options.columns[i]){obj.options.columns[i]={type:'text'};}else if(!obj.options.columns[i].type){obj.options.columns[i].type='text';}
if(!obj.options.columns[i].name){obj.options.columns[i].name=keys&&keys[i]?keys[i]:i;}
if(!obj.options.columns[i].source){obj.options.columns[i].source=[];}
if(!obj.options.columns[i].options){obj.options.columns[i].options=[];}
if(!obj.options.columns[i].editor){obj.options.columns[i].editor=null;}
if(!obj.options.columns[i].allowEmpty){obj.options.columns[i].allowEmpty=false;}
if(!obj.options.columns[i].title){obj.options.columns[i].title=obj.options.colHeaders[i]?obj.options.colHeaders[i]:'';}
if(!obj.options.columns[i].width){obj.options.columns[i].width=obj.options.colWidths[i]?obj.options.colWidths[i]:obj.options.defaultColWidth;}
if(!obj.options.columns[i].align){obj.options.columns[i].align=obj.options.colAlignments[i]?obj.options.colAlignments[i]:'center';}
if(obj.options.columns[i].type=='autocomplete'||obj.options.columns[i].type=='dropdown'){if(obj.options.columns[i].url){multiple.push({url:obj.options.columns[i].url,index:i,method:'GET',dataType:'json',success:function(data){var source=[];for(var i=0;i<data.length;i++){obj.options.columns[this.index].source.push(data[i]);}}});}}else if(obj.options.columns[i].type=='calendar'){if(!obj.options.columns[i].options.format){obj.options.columns[i].options.format='DD/MM/YYYY';}}}
if(!multiple.length){obj.createTable();}else{jSuites.ajax(multiple,function(){obj.createTable();});}}
obj.createTable=function(){obj.table=document.createElement('table');obj.thead=document.createElement('thead');obj.tbody=document.createElement('tbody');obj.headers=[];obj.colgroup=[];obj.content=document.createElement('div');obj.content.classList.add('jexcel_content');obj.content.onscroll=function(e){obj.scrollControls(e);}
obj.content.onwheel=function(e){obj.wheelControls(e);}
obj.toolbar=document.createElement('div');obj.toolbar.classList.add('jexcel_toolbar');var searchContainer=document.createElement('div');var searchText=document.createTextNode((obj.options.text.search)+': ');obj.searchInput=document.createElement('input');obj.searchInput.classList.add('jexcel_search');searchContainer.appendChild(searchText);searchContainer.appendChild(obj.searchInput);obj.searchInput.onfocus=function(){obj.resetSelection();}
var paginationUpdateContainer=document.createElement('div');if(obj.options.pagination>0&&obj.options.paginationOptions&&obj.options.paginationOptions.length>0){obj.paginationDropdown=document.createElement('select');obj.paginationDropdown.classList.add('jexcel_pagination_dropdown');obj.paginationDropdown.onchange=function(){obj.options.pagination=parseInt(this.value);obj.page(0);}
for(var i=0;i<obj.options.paginationOptions.length;i++){var temp=document.createElement('option');temp.value=obj.options.paginationOptions[i];temp.innerHTML=obj.options.paginationOptions[i];obj.paginationDropdown.appendChild(temp);}
obj.paginationDropdown.value=obj.options.pagination;paginationUpdateContainer.appendChild(document.createTextNode(obj.options.text.show));paginationUpdateContainer.appendChild(obj.paginationDropdown);paginationUpdateContainer.appendChild(document.createTextNode(obj.options.text.entries));}
var filter=document.createElement('div');filter.classList.add('jexcel_filter');filter.appendChild(paginationUpdateContainer);filter.appendChild(searchContainer);obj.colgroupContainer=document.createElement('colgroup');var tempCol=document.createElement('col');tempCol.setAttribute('width','50');obj.colgroupContainer.appendChild(tempCol);if(obj.options.nestedHeaders&&obj.options.nestedHeaders.length>0){if(obj.options.nestedHeaders[0]&&obj.options.nestedHeaders[0][0]){for(var j=0;j<obj.options.nestedHeaders.length;j++){obj.thead.appendChild(obj.createNestedHeader(obj.options.nestedHeaders[j]));}}else{obj.thead.appendChild(obj.createNestedHeader(obj.options.nestedHeaders));}}
obj.headerContainer=document.createElement('tr');var tempCol=document.createElement('td');tempCol.classList.add('jexcel_selectall');obj.headerContainer.appendChild(tempCol);for(var i=0;i<obj.options.columns.length;i++){obj.createCellHeader(i);obj.headerContainer.appendChild(obj.headers[i]);obj.colgroupContainer.appendChild(obj.colgroup[i]);}
obj.thead.appendChild(obj.headerContainer);if(obj.options.filters==true){obj.filter=document.createElement('tr');var td=document.createElement('td');obj.filter.appendChild(td);for(var i=0;i<obj.options.columns.length;i++){var td=document.createElement('td');td.innerHTML='&nbsp;';td.setAttribute('data-x',i);td.className='jexcel_column_filter';if(obj.options.columns[i].type=='hidden'){td.style.display='none';}
obj.filter.appendChild(td);}
obj.thead.appendChild(obj.filter);}
obj.table=document.createElement('table');obj.table.classList.add('jexcel');obj.table.setAttribute('cellpadding','0');obj.table.setAttribute('cellspacing','0');obj.table.setAttribute('unselectable','yes');obj.table.appendChild(obj.colgroupContainer);obj.table.appendChild(obj.thead);obj.table.appendChild(obj.tbody);if(!obj.options.textOverflow){obj.table.classList.add('jexcel_overflow');}
obj.corner=document.createElement('div');obj.corner.className='jexcel_corner';obj.corner.setAttribute('unselectable','on');obj.corner.setAttribute('onselectstart','return false');if(obj.options.selectionCopy==false){obj.corner.style.display='none';}
obj.textarea=document.createElement('textarea');obj.textarea.className='jexcel_textarea';obj.textarea.id='jexcel_textarea';obj.textarea.tabIndex='-1';obj.contextMenu=document.createElement('div');obj.contextMenu.className='jexcel_contextmenu';jSuites.contextmenu(obj.contextMenu,{onclick:function(){obj.contextMenu.contextmenu.close(false);}});var ads=document.createElement('a');ads.setAttribute('href','https://bossanova.uk/jspreadsheet/');obj.ads=document.createElement('div');obj.ads.className='jexcel_about';try{if(typeof(sessionStorage)!=="undefined"&&!sessionStorage.getItem('jexcel')){sessionStorage.setItem('jexcel',true);var img=document.createElement('img');img.src='//bossanova.uk/jspreadsheet/logo.png';ads.appendChild(img);}}catch(exception){}
var span=document.createElement('span');span.innerHTML='Jspreadsheet CE';ads.appendChild(span);obj.ads.appendChild(ads);var container=document.createElement('div');container.classList.add('jexcel_table');obj.pagination=document.createElement('div');obj.pagination.classList.add('jexcel_pagination');var paginationInfo=document.createElement('div');var paginationPages=document.createElement('div');obj.pagination.appendChild(paginationInfo);obj.pagination.appendChild(paginationPages);if(!obj.options.pagination){obj.pagination.style.display='none';}
if(obj.options.search==true){el.appendChild(filter);}
obj.content.appendChild(obj.table);obj.content.appendChild(obj.corner);obj.content.appendChild(obj.textarea);el.appendChild(obj.toolbar);el.appendChild(obj.content);el.appendChild(obj.pagination);el.appendChild(obj.contextMenu);el.appendChild(obj.ads);el.classList.add('jexcel_container');if(obj.options.toolbar&&obj.options.toolbar.length){obj.createToolbar();}
if(obj.options.fullscreen==true){el.classList.add('fullscreen');}else{if(obj.options.tableOverflow==true){if(obj.options.tableHeight){obj.content.style['overflow-y']='auto';obj.content.style['box-shadow']='rgb(221 221 221) 2px 2px 5px 0.1px';obj.content.style.maxHeight=obj.options.tableHeight;}
if(obj.options.tableWidth){obj.content.style['overflow-x']='auto';obj.content.style.width=obj.options.tableWidth;}}}
if(obj.options.tableOverflow!=true&&obj.options.toolbar){el.classList.add('with-toolbar');}
if(obj.options.columnDrag==true){obj.thead.classList.add('draggable');}
if(obj.options.columnResize==true){obj.thead.classList.add('resizable');}
if(obj.options.rowDrag==true){obj.tbody.classList.add('draggable');}
if(obj.options.rowResize==true){obj.tbody.classList.add('resizable');}
obj.setData();if(obj.options.style){obj.setStyle(obj.options.style,null,null,1,1);}
if(obj.options.classes){var k=Object.keys(obj.options.classes);for(var i=0;i<k.length;i++){var cell=jexcel.getIdFromColumnName(k[i],true);obj.records[cell[1]][cell[0]].classList.add(obj.options.classes[k[i]]);}}}
obj.refresh=function(){if(obj.options.url){if(obj.options.loadingSpin==true){jSuites.loading.show();}
jSuites.ajax({url:obj.options.url,method:obj.options.method,data:obj.options.requestVariables,dataType:'json',success:function(result){obj.options.data=(result.data)?result.data:result;obj.setData();if(obj.options.loadingSpin==true){jSuites.loading.hide();}}});}else{obj.setData();}}
obj.setData=function(data){if(data){if(typeof(data)=='string'){data=JSON.parse(data);}
obj.options.data=data;}
if(!obj.options.data){obj.options.data=[];}
if(obj.options.data&&obj.options.data[0]){if(!Array.isArray(obj.options.data[0])){var data=[];for(var j=0;j<obj.options.data.length;j++){var row=[];for(var i=0;i<obj.options.columns.length;i++){row[i]=obj.options.data[j][obj.options.columns[i].name];}
data.push(row);}
obj.options.data=data;}}
var j=0;var i=0;var size_i=obj.options.columns.length;var size_j=obj.options.data.length;var min_i=obj.options.minDimensions[0];var min_j=obj.options.minDimensions[1];var max_i=min_i>size_i?min_i:size_i;var max_j=min_j>size_j?min_j:size_j;for(j=0;j<max_j;j++){for(i=0;i<max_i;i++){if(obj.options.data[j]==undefined){obj.options.data[j]=[];}
if(obj.options.data[j][i]==undefined){obj.options.data[j][i]='';}}}
obj.rows=[];obj.results=null;obj.records=[];obj.history=[];obj.historyIndex=-1;obj.tbody.innerHTML='';if(obj.options.lazyLoading==true){var startNumber=0
var finalNumber=obj.options.data.length<100?obj.options.data.length:100;if(obj.options.pagination){obj.options.pagination=false;console.error('Jspreadsheet: Pagination will be disable due the lazyLoading');}}else if(obj.options.pagination){if(!obj.pageNumber){obj.pageNumber=0;}
var quantityPerPage=obj.options.pagination;startNumber=(obj.options.pagination*obj.pageNumber);finalNumber=(obj.options.pagination*obj.pageNumber)+obj.options.pagination;if(obj.options.data.length<finalNumber){finalNumber=obj.options.data.length;}}else{var startNumber=0;var finalNumber=obj.options.data.length;}
for(j=0;j<obj.options.data.length;j++){var tr=obj.createRow(j,obj.options.data[j]);if(j>=startNumber&&j<finalNumber){obj.tbody.appendChild(tr);}}
if(obj.options.lazyLoading==true){}else if(obj.options.pagination){obj.updatePagination();}
if(obj.options.mergeCells){var keys=Object.keys(obj.options.mergeCells);for(var i=0;i<keys.length;i++){var num=obj.options.mergeCells[keys[i]];obj.setMerge(keys[i],num[0],num[1],1);}}
obj.updateTable();obj.dispatch('onload',el,obj);}
obj.getData=function(highlighted,dataOnly){var dataset=[];var px=0;var py=0;var dataType=dataOnly==true||obj.options.copyCompatibility==false?true:false;var x=obj.options.columns.length
var y=obj.options.data.length
for(var j=0;j<y;j++){px=0;for(var i=0;i<x;i++){if(!highlighted||obj.records[j][i].classList.contains('highlight')){if(!dataset[py]){dataset[py]=[];}
if(!dataType){dataset[py][px]=obj.records[j][i].innerHTML;}else{dataset[py][px]=obj.options.data[j][i];}
px++;}}
if(px>0){py++;}}
return dataset;}
obj.getJsonRow=function(rowNumber){var rowData=obj.options.data[rowNumber];var x=obj.options.columns.length
var row={};for(var i=0;i<x;i++){if(!obj.options.columns[i].name){obj.options.columns[i].name=i;}
row[obj.options.columns[i].name]=rowData[i];}
return row;}
obj.getJson=function(highlighted){var data=[];var x=obj.options.columns.length
var y=obj.options.data.length
for(var j=0;j<y;j++){var row=null;for(var i=0;i<x;i++){if(!highlighted||obj.records[j][i].classList.contains('highlight')){if(row==null){row={};}
if(!obj.options.columns[i].name){obj.options.columns[i].name=i;}
row[obj.options.columns[i].name]=obj.options.data[j][i];}}
if(row!=null){data.push(row);}}
return data;}
obj.prepareJson=function(data){var rows=[];for(var i=0;i<data.length;i++){var x=data[i].x;var y=data[i].y;var k=obj.options.columns[x].name?obj.options.columns[x].name:x;if(!rows[y]){rows[y]={row:y,data:{},};}
rows[y].data[k]=data[i].newValue;}
return rows.filter(function(el){return el!=null;});}
obj.save=function(url,data){var ret=obj.dispatch('onbeforesave',el,obj,data);if(ret){var data=ret;}else{if(ret===false){return false;}}
jSuites.ajax({url:url,method:'POST',dataType:'json',data:{data:JSON.stringify(data)},success:function(result){obj.dispatch('onsave',el,obj,data);}});}
obj.getRowData=function(rowNumber){return obj.options.data[rowNumber];}
obj.setRowData=function(rowNumber,data){for(var i=0;i<obj.headers.length;i++){var columnName=jexcel.getColumnNameFromId([i,rowNumber]);if(data[i]!=null){obj.setValue(columnName,data[i]);}}}
obj.getColumnData=function(columnNumber){var dataset=[];for(var j=0;j<obj.options.data.length;j++){dataset.push(obj.options.data[j][columnNumber]);}
return dataset;}
obj.setColumnData=function(colNumber,data){for(var j=0;j<obj.rows.length;j++){var columnName=jexcel.getColumnNameFromId([colNumber,j]);if(data[j]!=null){obj.setValue(columnName,data[j]);}}}
obj.createRow=function(j,data){if(!obj.records[j]){obj.records[j]=[];}
if(!data){var data=obj.options.data[j];}
obj.rows[j]=document.createElement('tr');obj.rows[j].setAttribute('data-y',j);var index=null;if(obj.options.defaultRowHeight){obj.rows[j].style.height=obj.options.defaultRowHeight+'px'}
if(obj.options.rows[j]){if(obj.options.rows[j].height){obj.rows[j].style.height=obj.options.rows[j].height;}
if(obj.options.rows[j].title){index=obj.options.rows[j].title;}}
if(!index){index=parseInt(j+1);}
var td=document.createElement('td');td.innerHTML=index;td.setAttribute('data-y',j);td.className='jexcel_row';obj.rows[j].appendChild(td);for(var i=0;i<obj.options.columns.length;i++){obj.records[j][i]=obj.createCell(i,j,data[i]);obj.rows[j].appendChild(obj.records[j][i]);}
return obj.rows[j];}
obj.parseValue=function(i,j,value,cell){if((''+value).substr(0,1)=='='&&obj.options.parseFormulas==true){value=obj.executeFormula(value,i,j)}
var options=obj.options.columns[i];if(options&&!isFormula(value)){var opt=null;if(opt=getMask(options)){if(value&&value==Number(value)){value=Number(value);}
var masked=jSuites.mask.render(value,opt,true);if(cell){if(opt.mask){var t=opt.mask.split(';');if(t[1]){var t1=t[1].match(new RegExp('\\[Red\\]','gi'));if(t1){if(value<0){cell.classList.add('red');}else{cell.classList.remove('red');}}
var t2=t[1].match(new RegExp('\\(','gi'));if(t2){if(value<0){masked='('+masked+')';}}}}}
if(masked){value=masked;}}}
return value;}
var validDate=function(date){date=''+date;if(date.substr(4,1)=='-'&&date.substr(7,1)=='-'){return true;}else{date=date.split('-');if((date[0].length==4&&date[0]==Number(date[0])&&date[1].length==2&&date[1]==Number(date[1]))){return true;}}
return false;}
obj.createCell=function(i,j,value){var td=document.createElement('td');td.setAttribute('data-x',i);td.setAttribute('data-y',j);if((''+value).substr(0,1)=='='&&obj.options.secureFormulas==true){var val=secureFormula(value);if(val!=value){value=val;}}
if(obj.options.columns[i].editor){if(obj.options.stripHTML===false||obj.options.columns[i].stripHTML===false){td.innerHTML=value;}else{td.innerText=value;}
if(typeof(obj.options.columns[i].editor.createCell)=='function'){td=obj.options.columns[i].editor.createCell(td);}}else{if(obj.options.columns[i].type=='hidden'){td.style.display='none';td.innerText=value;}else if(obj.options.columns[i].type=='checkbox'||obj.options.columns[i].type=='radio'){var element=document.createElement('input');element.type=obj.options.columns[i].type;element.name='c'+i;element.checked=(value==1||value==true||value=='true')?true:false;element.onclick=function(){obj.setValue(td,this.checked);}
if(obj.options.columns[i].readOnly==true||obj.options.editable==false){element.setAttribute('disabled','disabled');}
td.appendChild(element);obj.options.data[j][i]=element.checked;}else if(obj.options.columns[i].type=='calendar'){var formatted=null;if(!validDate(value)){var tmp=jSuites.calendar.extractDateFromString(value,obj.options.columns[i].options.format);if(tmp){formatted=tmp;}}
td.innerText=jSuites.calendar.getDateString(formatted?formatted:value,obj.options.columns[i].options.format);}else if(obj.options.columns[i].type=='dropdown'||obj.options.columns[i].type=='autocomplete'){td.classList.add('jexcel_dropdown');td.innerText=obj.getDropDownValue(i,value);}else if(obj.options.columns[i].type=='color'){if(obj.options.columns[i].render=='square'){var color=document.createElement('div');color.className='color';color.style.backgroundColor=value;td.appendChild(color);}else{td.style.color=value;td.innerText=value;}}else if(obj.options.columns[i].type=='image'){if(value&&value.substr(0,10)=='data:image'){var img=document.createElement('img');img.src=value;td.appendChild(img);}}else{if(obj.options.columns[i].type=='html'){td.innerHTML=stripScript(obj.parseValue(i,j,value,td));}else{if(obj.options.stripHTML===false||obj.options.columns[i].stripHTML===false){td.innerHTML=stripScript(obj.parseValue(i,j,value,td));}else{td.innerText=obj.parseValue(i,j,value,td);}}}}
if(obj.options.columns[i].readOnly==true){td.className='readonly';}
var colAlign=obj.options.columns[i].align?obj.options.columns[i].align:'center';td.style.textAlign=colAlign;if(obj.options.columns[i].wordWrap!=false&&(obj.options.wordWrap==true||obj.options.columns[i].wordWrap==true||td.innerHTML.length>200)){td.style.whiteSpace='pre-wrap';}
if(i>0){if(this.options.textOverflow==true){if(value||td.innerHTML){obj.records[j][i-1].style.overflow='hidden';}else{if(i==obj.options.columns.length-1){td.style.overflow='hidden';}}}}
return td;}
obj.createCellHeader=function(colNumber){var colWidth=obj.options.columns[colNumber].width?obj.options.columns[colNumber].width:obj.options.defaultColWidth;var colAlign=obj.options.columns[colNumber].align?obj.options.columns[colNumber].align:obj.options.defaultColAlign;obj.headers[colNumber]=document.createElement('td');if(obj.options.stripHTML){obj.headers[colNumber].innerText=obj.options.columns[colNumber].title?obj.options.columns[colNumber].title:jexcel.getColumnName(colNumber);}else{obj.headers[colNumber].innerHTML=obj.options.columns[colNumber].title?obj.options.columns[colNumber].title:jexcel.getColumnName(colNumber);}
obj.headers[colNumber].setAttribute('data-x',colNumber);obj.headers[colNumber].style.textAlign=colAlign;if(obj.options.columns[colNumber].title){obj.headers[colNumber].setAttribute('title',obj.options.columns[colNumber].title);}
if(obj.options.columns[colNumber].id){obj.headers[colNumber].setAttribute('id',obj.options.columns[colNumber].id);}
obj.colgroup[colNumber]=document.createElement('col');obj.colgroup[colNumber].setAttribute('width',colWidth);if(obj.options.columns[colNumber].type=='hidden'){obj.headers[colNumber].style.display='none';obj.colgroup[colNumber].style.display='none';}}
obj.updateNestedHeader=function(x,y,title){if(obj.options.nestedHeaders[y][x].title){obj.options.nestedHeaders[y][x].title=title;obj.options.nestedHeaders[y].element.children[x+1].innerText=title;}}
obj.createNestedHeader=function(nestedInformation){var tr=document.createElement('tr');tr.classList.add('jexcel_nested');var td=document.createElement('td');tr.appendChild(td);nestedInformation.element=tr;var headerIndex=0;for(var i=0;i<nestedInformation.length;i++){if(!nestedInformation[i].colspan){nestedInformation[i].colspan=1;}
if(!nestedInformation[i].align){nestedInformation[i].align='center';}
if(!nestedInformation[i].title){nestedInformation[i].title='';}
var numberOfColumns=nestedInformation[i].colspan;var column=[];for(var x=0;x<numberOfColumns;x++){if(obj.options.columns[headerIndex]&&obj.options.columns[headerIndex].type=='hidden'){numberOfColumns++;}
column.push(headerIndex);headerIndex++;}
var td=document.createElement('td');td.setAttribute('data-column',column.join(','));td.setAttribute('colspan',nestedInformation[i].colspan);td.setAttribute('align',nestedInformation[i].align);td.innerText=nestedInformation[i].title;tr.appendChild(td);}
return tr;}
obj.createToolbar=function(toolbar){if(toolbar){obj.options.toolbar=toolbar;}else{var toolbar=obj.options.toolbar;}
for(var i=0;i<toolbar.length;i++){if(toolbar[i].type=='i'){var toolbarItem=document.createElement('i');toolbarItem.classList.add('jexcel_toolbar_item');toolbarItem.classList.add('material-icons');toolbarItem.setAttribute('data-k',toolbar[i].k);toolbarItem.setAttribute('data-v',toolbar[i].v);toolbarItem.setAttribute('id',toolbar[i].id);if(toolbar[i].tooltip){toolbarItem.setAttribute('title',toolbar[i].tooltip);}
if(toolbar[i].onclick&&typeof(toolbar[i].onclick)){toolbarItem.onclick=(function(a){var b=a;return function(){toolbar[b].onclick(el,obj,this);};})(i);}else{toolbarItem.onclick=function(){var k=this.getAttribute('data-k');var v=this.getAttribute('data-v');obj.setStyle(obj.highlighted,k,v);}}
toolbarItem.innerText=toolbar[i].content;obj.toolbar.appendChild(toolbarItem);}else if(toolbar[i].type=='select'){var toolbarItem=document.createElement('select');toolbarItem.classList.add('jexcel_toolbar_item');toolbarItem.setAttribute('data-k',toolbar[i].k);if(toolbar[i].tooltip){toolbarItem.setAttribute('title',toolbar[i].tooltip);}
if(toolbar[i].onchange&&typeof(toolbar[i].onchange)){toolbarItem.onchange=toolbar[i].onchange;}else{toolbarItem.onchange=function(){var k=this.getAttribute('data-k');obj.setStyle(obj.highlighted,k,this.value);}}
for(var j=0;j<toolbar[i].v.length;j++){var toolbarDropdownOption=document.createElement('option');toolbarDropdownOption.value=toolbar[i].v[j];toolbarDropdownOption.innerText=toolbar[i].v[j];toolbarItem.appendChild(toolbarDropdownOption);}
obj.toolbar.appendChild(toolbarItem);}else if(toolbar[i].type=='color'){var toolbarItem=document.createElement('i');toolbarItem.classList.add('jexcel_toolbar_item');toolbarItem.classList.add('material-icons');toolbarItem.setAttribute('data-k',toolbar[i].k);toolbarItem.setAttribute('data-v','');if(toolbar[i].tooltip){toolbarItem.setAttribute('title',toolbar[i].tooltip);}
obj.toolbar.appendChild(toolbarItem);toolbarItem.innerText=toolbar[i].content;jSuites.color(toolbarItem,{onchange:function(o,v){var k=o.getAttribute('data-k');obj.setStyle(obj.highlighted,k,v);}});}}}
obj.setMerge=function(cellName,colspan,rowspan,ignoreHistoryAndEvents){var test=false;if(!cellName){if(!obj.highlighted.length){alert(obj.options.text.noCellsSelected);return null;}else{var x1=parseInt(obj.highlighted[0].getAttribute('data-x'));var y1=parseInt(obj.highlighted[0].getAttribute('data-y'));var x2=parseInt(obj.highlighted[obj.highlighted.length-1].getAttribute('data-x'));var y2=parseInt(obj.highlighted[obj.highlighted.length-1].getAttribute('data-y'));var cellName=jexcel.getColumnNameFromId([x1,y1]);var colspan=(x2-x1)+1;var rowspan=(y2-y1)+1;}}
var cell=jexcel.getIdFromColumnName(cellName,true);if(obj.options.mergeCells[cellName]){if(obj.records[cell[1]][cell[0]].getAttribute('data-merged')){test=obj.options.text.cellAlreadyMerged;}}else if((!colspan||colspan<2)&&(!rowspan||rowspan<2)){test=obj.options.text.invalidMergeProperties;}else{var cells=[];for(var j=cell[1];j<cell[1]+rowspan;j++){for(var i=cell[0];i<cell[0]+colspan;i++){var columnName=jexcel.getColumnNameFromId([i,j]);if(obj.records[j][i].getAttribute('data-merged')){test=obj.options.text.thereIsAConflictWithAnotherMergedCell;}}}}
if(test){alert(test);}else{if(colspan>1){obj.records[cell[1]][cell[0]].setAttribute('colspan',colspan);}else{colspan=1;}
if(rowspan>1){obj.records[cell[1]][cell[0]].setAttribute('rowspan',rowspan);}else{rowspan=1;}
obj.options.mergeCells[cellName]=[colspan,rowspan,[]];obj.records[cell[1]][cell[0]].setAttribute('data-merged','true');obj.records[cell[1]][cell[0]].style.overflow='hidden';var data=[];for(var y=cell[1];y<cell[1]+rowspan;y++){for(var x=cell[0];x<cell[0]+colspan;x++){if(!(cell[0]==x&&cell[1]==y)){data.push(obj.options.data[y][x]);obj.updateCell(x,y,'',true);obj.options.mergeCells[cellName][2].push(obj.records[y][x]);obj.records[y][x].style.display='none';obj.records[y][x]=obj.records[cell[1]][cell[0]];}}}
obj.updateSelection(obj.records[cell[1]][cell[0]]);if(!ignoreHistoryAndEvents){obj.setHistory({action:'setMerge',column:cellName,colspan:colspan,rowspan:rowspan,data:data,});obj.dispatch('onmerge',el,cellName,colspan,rowspan);}}}
obj.getMerge=function(cellName){var data={};if(cellName){if(obj.options.mergeCells[cellName]){data=[obj.options.mergeCells[cellName][0],obj.options.mergeCells[cellName][1]];}else{data=null;}}else{if(obj.options.mergeCells){var mergedCells=obj.options.mergeCells;var keys=Object.keys(obj.options.mergeCells);for(var i=0;i<keys.length;i++){data[keys[i]]=[obj.options.mergeCells[keys[i]][0],obj.options.mergeCells[keys[i]][1]];}}}
return data;}
obj.removeMerge=function(cellName,data,keepOptions){if(obj.options.mergeCells[cellName]){var cell=jexcel.getIdFromColumnName(cellName,true);obj.records[cell[1]][cell[0]].removeAttribute('colspan');obj.records[cell[1]][cell[0]].removeAttribute('rowspan');obj.records[cell[1]][cell[0]].removeAttribute('data-merged');var info=obj.options.mergeCells[cellName];var index=0;for(var j=0;j<info[1];j++){for(var i=0;i<info[0];i++){if(j>0||i>0){obj.records[cell[1]+j][cell[0]+i]=info[2][index];obj.records[cell[1]+j][cell[0]+i].style.display='';if(data&&data[index]){obj.updateCell(cell[0]+i,cell[1]+j,data[index]);}
index++;}}}
obj.updateSelection(obj.records[cell[1]][cell[0]],obj.records[cell[1]+j-1][cell[0]+i-1]);if(!keepOptions){delete(obj.options.mergeCells[cellName]);}}}
obj.destroyMerged=function(keepOptions){if(obj.options.mergeCells){var mergedCells=obj.options.mergeCells;var keys=Object.keys(obj.options.mergeCells);for(var i=0;i<keys.length;i++){obj.removeMerge(keys[i],null,keepOptions);}}}
obj.isColMerged=function(x,insertBefore){var cols=[];if(obj.options.mergeCells){var keys=Object.keys(obj.options.mergeCells);for(var i=0;i<keys.length;i++){var info=jexcel.getIdFromColumnName(keys[i],true);var colspan=obj.options.mergeCells[keys[i]][0];var x1=info[0];var x2=info[0]+(colspan>1?colspan-1:0);if(insertBefore==null){if((x1<=x&&x2>=x)){cols.push(keys[i]);}}else{if(insertBefore){if((x1<x&&x2>=x)){cols.push(keys[i]);}}else{if((x1<=x&&x2>x)){cols.push(keys[i]);}}}}}
return cols;}
obj.isRowMerged=function(y,insertBefore){var rows=[];if(obj.options.mergeCells){var keys=Object.keys(obj.options.mergeCells);for(var i=0;i<keys.length;i++){var info=jexcel.getIdFromColumnName(keys[i],true);var rowspan=obj.options.mergeCells[keys[i]][1];var y1=info[1];var y2=info[1]+(rowspan>1?rowspan-1:0);if(insertBefore==null){if((y1<=y&&y2>=y)){rows.push(keys[i]);}}else{if(insertBefore){if((y1<y&&y2>=y)){rows.push(keys[i]);}}else{if((y1<=y&&y2>y)){rows.push(keys[i]);}}}}}
return rows;}
obj.openFilter=function(columnId){if(!obj.options.filters){console.log('Jspreadsheet: filters not enabled.');}else{columnId=parseInt(columnId);obj.resetSelection();var optionsFiltered=[];if(obj.options.columns[columnId].type=='checkbox'){optionsFiltered.push({id:'true',name:'True'});optionsFiltered.push({id:'false',name:'False'});}else{var options=[];var hasBlanks=false;for(var j=0;j<obj.options.data.length;j++){var k=obj.options.data[j][columnId];var v=obj.records[j][columnId].innerHTML;if(k&&v){options[k]=v;}else{var hasBlanks=true;}}
var keys=Object.keys(options);var optionsFiltered=[];for(var j=0;j<keys.length;j++){optionsFiltered.push({id:keys[j],name:options[keys[j]]});}
if(hasBlanks){optionsFiltered.push({value:'',id:'',name:'(Blanks)'});}}
var div=document.createElement('div');obj.filter.children[columnId+1].innerHTML='';obj.filter.children[columnId+1].appendChild(div);obj.filter.children[columnId+1].style.paddingLeft='0px';obj.filter.children[columnId+1].style.paddingRight='0px';obj.filter.children[columnId+1].style.overflow='initial';var opt={data:optionsFiltered,multiple:true,autocomplete:true,opened:true,value:obj.filters[columnId]!==undefined?obj.filters[columnId]:null,width:'100%',position:(obj.options.tableOverflow==true||obj.options.fullscreen==true)?true:false,onclose:function(o){obj.resetFilters();obj.filters[columnId]=o.dropdown.getValue(true);obj.filter.children[columnId+1].innerHTML=o.dropdown.getText();obj.filter.children[columnId+1].style.paddingLeft='';obj.filter.children[columnId+1].style.paddingRight='';obj.filter.children[columnId+1].style.overflow='';obj.closeFilter(columnId);obj.refreshSelection();}};jSuites.dropdown(div,opt);}}
obj.resetFilters=function(){if(obj.options.filters){for(var i=0;i<obj.filter.children.length;i++){obj.filter.children[i].innerHTML='&nbsp;';obj.filters[i]=null;}}
obj.results=null;obj.updateResult();}
obj.closeFilter=function(columnId){if(!columnId){for(var i=0;i<obj.filter.children.length;i++){if(obj.filters[i]){columnId=i;}}}
var search=function(query,x,y){for(var i=0;i<query.length;i++){var value=''+obj.options.data[y][x];var label=''+obj.records[y][x].innerHTML;if(query[i]==value||query[i]==label){return true;}}
return false;}
var query=obj.filters[columnId];obj.results=[];for(var j=0;j<obj.options.data.length;j++){if(search(query,columnId,j)){obj.results.push(j);}}
if(!obj.results.length){obj.results=null;}
obj.updateResult();}
obj.openEditor=function(cell,empty,e){var y=cell.getAttribute('data-y');var x=cell.getAttribute('data-x');obj.dispatch('oneditionstart',el,cell,x,y);if(x>0){obj.records[y][x-1].style.overflow='hidden';}
var createEditor=function(type){var info=cell.getBoundingClientRect();var editor=document.createElement(type);editor.style.width=(info.width)+'px';editor.style.height=(info.height-2)+'px';editor.style.minHeight=(info.height-2)+'px';cell.classList.add('editor');cell.innerHTML='';cell.appendChild(editor);obj.dispatch('oncreateeditor',el,cell,x,y,editor);return editor;}
if(cell.classList.contains('readonly')==true){}else{obj.edition=[obj.records[y][x],obj.records[y][x].innerHTML,x,y];if(obj.options.columns[x].editor){obj.options.columns[x].editor.openEditor(cell,el,empty,e);}else{if(obj.options.columns[x].type=='hidden'){}else if(obj.options.columns[x].type=='checkbox'||obj.options.columns[x].type=='radio'){var value=cell.children[0].checked?false:true;obj.setValue(cell,value);obj.edition=null;}else if(obj.options.columns[x].type=='dropdown'||obj.options.columns[x].type=='autocomplete'){var value=obj.options.data[y][x];if(obj.options.columns[x].multiple&&!Array.isArray(value)){value=value.split(';');}
if(typeof(obj.options.columns[x].filter)=='function'){var source=obj.options.columns[x].filter(el,cell,x,y,obj.options.columns[x].source);}else{var source=obj.options.columns[x].source;}
var data=[];for(var j=0;j<source.length;j++){data.push(source[j]);}
var editor=createEditor('div');var options={data:data,multiple:obj.options.columns[x].multiple?true:false,autocomplete:obj.options.columns[x].autocomplete||obj.options.columns[x].type=='autocomplete'?true:false,opened:true,value:value,width:'100%',height:editor.style.minHeight,position:(obj.options.tableOverflow==true||obj.options.fullscreen==true)?true:false,onclose:function(){obj.closeEditor(cell,true);}};if(obj.options.columns[x].options&&obj.options.columns[x].options.type){options.type=obj.options.columns[x].options.type;}
jSuites.dropdown(editor,options);}else if(obj.options.columns[x].type=='calendar'||obj.options.columns[x].type=='color'){var value=obj.options.data[y][x];var editor=createEditor('input');editor.value=value;if(obj.options.tableOverflow==true||obj.options.fullscreen==true){obj.options.columns[x].options.position=true;}
obj.options.columns[x].options.value=obj.options.data[y][x];obj.options.columns[x].options.opened=true;obj.options.columns[x].options.onclose=function(el,value){obj.closeEditor(cell,true);}
if(obj.options.columns[x].type=='color'){jSuites.color(editor,obj.options.columns[x].options);}else{jSuites.calendar(editor,obj.options.columns[x].options);}
editor.focus();}else if(obj.options.columns[x].type=='html'){var value=obj.options.data[y][x];var editor=createEditor('div');editor.style.position='relative';var div=document.createElement('div');div.classList.add('jexcel_richtext');editor.appendChild(div);jSuites.editor(div,{focus:true,value:value,});var rect=cell.getBoundingClientRect();var rectContent=div.getBoundingClientRect();if(window.innerHeight<rect.bottom+rectContent.height){div.style.top=(rect.top-(rectContent.height+2))+'px';}else{div.style.top=(rect.top)+'px';}}else if(obj.options.columns[x].type=='image'){var img=cell.children[0];var editor=createEditor('div');editor.style.position='relative';var div=document.createElement('div');div.classList.add('jclose');if(img&&img.src){div.appendChild(img);}
editor.appendChild(div);jSuites.image(div,obj.options.imageOptions);var rect=cell.getBoundingClientRect();var rectContent=div.getBoundingClientRect();if(window.innerHeight<rect.bottom+rectContent.height){div.style.top=(rect.top-(rectContent.height+2))+'px';}else{div.style.top=(rect.top)+'px';}}else{var value=empty==true?'':obj.options.data[y][x];if(obj.options.columns[x].wordWrap!=false&&(obj.options.wordWrap==true||obj.options.columns[x].wordWrap==true)){var editor=createEditor('textarea');}else{var editor=createEditor('input');}
editor.focus();editor.value=value;var options=obj.options.columns[x];var opt=null;if(!isFormula(value)){if(opt=getMask(options)){if(!options.disabledMaskOnEdition){if(options.mask){var m=options.mask.split(';')
editor.setAttribute('data-mask',m[0]);}else if(options.locale){editor.setAttribute('data-locale',options.locale);}}
opt.input=editor;editor.mask=opt;jSuites.mask.render(value,opt,false);}}
editor.onblur=function(){obj.closeEditor(cell,true);};editor.scrollLeft=editor.scrollWidth;}}}}
obj.closeEditor=function(cell,save){var x=parseInt(cell.getAttribute('data-x'));var y=parseInt(cell.getAttribute('data-y'));if(save==true){if(obj.options.columns[x].editor){var value=obj.options.columns[x].editor.closeEditor(cell,save);}else{if(obj.options.columns[x].type=='checkbox'||obj.options.columns[x].type=='radio'||obj.options.columns[x].type=='hidden'){}else if(obj.options.columns[x].type=='dropdown'||obj.options.columns[x].type=='autocomplete'){var value=cell.children[0].dropdown.close(true);}else if(obj.options.columns[x].type=='calendar'){var value=cell.children[0].calendar.close(true);}else if(obj.options.columns[x].type=='color'){var value=cell.children[0].color.close(true);}else if(obj.options.columns[x].type=='html'){var value=cell.children[0].children[0].editor.getData();}else if(obj.options.columns[x].type=='image'){var img=cell.children[0].children[0].children[0];var value=img&&img.tagName=='IMG'?img.src:'';}else if(obj.options.columns[x].type=='numeric'){var value=cell.children[0].value;if((''+value).substr(0,1)!='='){if(value==''){value=obj.options.columns[x].allowEmpty?'':0;}}
cell.children[0].onblur=null;}else{var value=cell.children[0].value;cell.children[0].onblur=null;var options=obj.options.columns[x];var opt=null;if(opt=getMask(options)){if(value!==''&&!isFormula(value)&&typeof(value)!=='number'){var t=jSuites.mask.extract(value,opt,true);if(t&&t.value!==''){value=t.value;}}}}}
if(obj.options.data[y][x]==value){cell.innerHTML=obj.edition[1];}else{obj.setValue(cell,value);}}else{if(obj.options.columns[x].editor){obj.options.columns[x].editor.closeEditor(cell,save);}else{if(obj.options.columns[x].type=='dropdown'||obj.options.columns[x].type=='autocomplete'){cell.children[0].dropdown.close(true);}else if(obj.options.columns[x].type=='calendar'){cell.children[0].calendar.close(true);}else if(obj.options.columns[x].type=='color'){cell.children[0].color.close(true);}else{cell.children[0].onblur=null;}}
cell.innerHTML=obj.edition&&obj.edition[1]?obj.edition[1]:'';}
obj.dispatch('oneditionend',el,cell,x,y,value,save);cell.classList.remove('editor');obj.edition=null;}
obj.getCell=function(cell){cell=jexcel.getIdFromColumnName(cell,true);var x=cell[0];var y=cell[1];return obj.records[y][x];}
obj.getColumnOptions=function(x,y){var options=obj.options.columns[x];if(!options){options={type:'text'};}
return options;}
obj.getCellFromCoords=function(x,y){return obj.records[y][x];}
obj.getLabel=function(cell){cell=jexcel.getIdFromColumnName(cell,true);var x=cell[0];var y=cell[1];return obj.records[y][x].innerHTML;}
obj.getLabelFromCoords=function(x,y){return obj.records[y][x].innerHTML;}
obj.getValue=function(cell,processedValue){if(typeof(cell)=='object'){var x=cell.getAttribute('data-x');var y=cell.getAttribute('data-y');}else{cell=jexcel.getIdFromColumnName(cell,true);var x=cell[0];var y=cell[1];}
var value=null;if(x!=null&&y!=null){if(obj.records[y]&&obj.records[y][x]&&(processedValue||obj.options.copyCompatibility==true)){value=obj.records[y][x].innerHTML;}else{if(obj.options.data[y]&&obj.options.data[y][x]!='undefined'){value=obj.options.data[y][x];}}}
return value;}
obj.getValueFromCoords=function(x,y,processedValue){var value=null;if(x!=null&&y!=null){if((obj.records[y]&&obj.records[y][x])&&processedValue||obj.options.copyCompatibility==true){value=obj.records[y][x].innerHTML;}else{if(obj.options.data[y]&&obj.options.data[y][x]!='undefined'){value=obj.options.data[y][x];}}}
return value;}
obj.setValue=function(cell,value,force){var records=[];if(typeof(cell)=='string'){var columnId=jexcel.getIdFromColumnName(cell,true);var x=columnId[0];var y=columnId[1];records.push(obj.updateCell(x,y,value,force));obj.updateFormulaChain(x,y,records);}else{var x=null;var y=null;if(cell&&cell.getAttribute){var x=cell.getAttribute('data-x');var y=cell.getAttribute('data-y');}
if(x!=null&&y!=null){records.push(obj.updateCell(x,y,value,force));obj.updateFormulaChain(x,y,records);}else{var keys=Object.keys(cell);if(keys.length>0){for(var i=0;i<keys.length;i++){if(typeof(cell[i])=='string'){var columnId=jexcel.getIdFromColumnName(cell[i],true);var x=columnId[0];var y=columnId[1];}else{if(cell[i].x!=null&&cell[i].y!=null){var x=cell[i].x;var y=cell[i].y;if(cell[i].newValue!=null){value=cell[i].newValue;}else if(cell[i].value!=null){value=cell[i].value;}}else{var x=cell[i].getAttribute('data-x');var y=cell[i].getAttribute('data-y');}}
if(x!=null&&y!=null){records.push(obj.updateCell(x,y,value,force));obj.updateFormulaChain(x,y,records);}}}}}
obj.setHistory({action:'setValue',records:records,selection:obj.selectedCell,});obj.updateTable();obj.onafterchanges(el,records);}
obj.setValueFromCoords=function(x,y,value,force){var records=[];records.push(obj.updateCell(x,y,value,force));obj.updateFormulaChain(x,y,records);obj.setHistory({action:'setValue',records:records,selection:obj.selectedCell,});obj.updateTable();obj.onafterchanges(el,records);}
obj.setCheckRadioValue=function(){var records=[];var keys=Object.keys(obj.highlighted);for(var i=0;i<keys.length;i++){var x=obj.highlighted[i].getAttribute('data-x');var y=obj.highlighted[i].getAttribute('data-y');if(obj.options.columns[x].type=='checkbox'||obj.options.columns[x].type=='radio'){records.push(obj.updateCell(x,y,!obj.options.data[y][x]));}}
if(records.length){obj.setHistory({action:'setValue',records:records,selection:obj.selectedCell,});obj.onafterchanges(el,records);}}
var stripScript=function(a){var b=new Option;b.innerHTML=a;var c=null;for(a=b.getElementsByTagName('script');c=a[0];)c.parentNode.removeChild(c);return b.innerHTML;}
obj.updateCell=function(x,y,value,force){if(obj.records[y][x].classList.contains('readonly')==true&&!force){var record={x:x,y:y,col:x,row:y}}else{if((''+value).substr(0,1)=='='&&obj.options.secureFormulas==true){var val=secureFormula(value);if(val!=value){value=val;}}
var val=obj.dispatch('onbeforechange',el,obj.records[y][x],x,y,value);if(val!=undefined){value=val;}
if(obj.options.columns[x].editor&&typeof(obj.options.columns[x].editor.updateCell)=='function'){value=obj.options.columns[x].editor.updateCell(obj.records[y][x],value,force);}
var record={x:x,y:y,col:x,row:y,newValue:value,oldValue:obj.options.data[y][x],}
if(obj.options.columns[x].editor){obj.options.data[y][x]=value;}else{if(obj.options.columns[x].type=='checkbox'||obj.options.columns[x].type=='radio'){if(obj.options.columns[x].type=='radio'){for(var j=0;j<obj.options.data.length;j++){obj.options.data[j][x]=false;}}
obj.records[y][x].children[0].checked=(value==1||value==true||value=='true'||value=='TRUE')?true:false;obj.options.data[y][x]=obj.records[y][x].children[0].checked;}else if(obj.options.columns[x].type=='dropdown'||obj.options.columns[x].type=='autocomplete'){obj.options.data[y][x]=value;obj.records[y][x].innerText=obj.getDropDownValue(x,value);}else if(obj.options.columns[x].type=='calendar'){var formatted=null;if(!validDate(value)){var tmp=jSuites.calendar.extractDateFromString(value,obj.options.columns[x].options.format);if(tmp){formatted=tmp;}}
obj.options.data[y][x]=value;obj.records[y][x].innerText=jSuites.calendar.getDateString(formatted?formatted:value,obj.options.columns[x].options.format);}else if(obj.options.columns[x].type=='color'){obj.options.data[y][x]=value;if(obj.options.columns[x].render=='square'){var color=document.createElement('div');color.className='color';color.style.backgroundColor=value;obj.records[y][x].innerText='';obj.records[y][x].appendChild(color);}else{obj.records[y][x].style.color=value;obj.records[y][x].innerText=value;}}else if(obj.options.columns[x].type=='image'){value=''+value;obj.options.data[y][x]=value;obj.records[y][x].innerHTML='';if(value&&value.substr(0,10)=='data:image'){var img=document.createElement('img');img.src=value;obj.records[y][x].appendChild(img);}}else{obj.options.data[y][x]=value;if(obj.options.columns[x].type=='html'){obj.records[y][x].innerHTML=stripScript(obj.parseValue(x,y,value));}else{if(obj.options.stripHTML===false||obj.options.columns[x].stripHTML===false){obj.records[y][x].innerHTML=stripScript(obj.parseValue(x,y,value,obj.records[y][x]));}else{obj.records[y][x].innerText=obj.parseValue(x,y,value,obj.records[y][x]);}}
if(obj.options.columns[x].wordWrap!=false&&(obj.options.wordWrap==true||obj.options.columns[x].wordWrap==true||obj.records[y][x].innerHTML.length>200)){obj.records[y][x].style.whiteSpace='pre-wrap';}else{obj.records[y][x].style.whiteSpace='';}}}
if(x>0){if(value){obj.records[y][x-1].style.overflow='hidden';}else{obj.records[y][x-1].style.overflow='';}}
obj.dispatch('onchange',el,(obj.records[y]&&obj.records[y][x]?obj.records[y][x]:null),x,y,value,record.oldValue);}
return record;}
obj.copyData=function(o,d){var data=obj.getData(true,true);var h=obj.selectedContainer;var x1=parseInt(o.getAttribute('data-x'));var y1=parseInt(o.getAttribute('data-y'));var x2=parseInt(d.getAttribute('data-x'));var y2=parseInt(d.getAttribute('data-y'));var records=[];var breakControl=false;if(h[0]==x1){if(y1<h[1]){var rowNumber=y1-h[1];}else{var rowNumber=1;}
var colNumber=0;}else{if(x1<h[0]){var colNumber=x1-h[0];}else{var colNumber=1;}
var rowNumber=0;}
var posx=0;var posy=0;for(var j=y1;j<=y2;j++){if(obj.rows[j]&&obj.rows[j].style.display=='none'){continue;}
if(data[posy]==undefined){posy=0;}
posx=0;if(h[0]!=x1){if(x1<h[0]){var colNumber=x1-h[0];}else{var colNumber=1;}}
for(var i=x1;i<=x2;i++){if(obj.records[j][i]&&!obj.records[j][i].classList.contains('readonly')&&obj.records[j][i].style.display!='none'&&breakControl==false){if(!obj.selection.length){if(obj.options.data[j][i]!=''){breakControl=true;continue;}}
if(data[posy]==undefined){posx=0;}else if(data[posy][posx]==undefined){posx=0;}
var value=data[posy][posx];if(value&&!data[1]&&obj.options.autoIncrement==true){if(obj.options.columns[i].type=='text'||obj.options.columns[i].type=='number'){if((''+value).substr(0,1)=='='){var tokens=value.match(/([A-Z]+[0-9]+)/g);if(tokens){var affectedTokens=[];for(var index=0;index<tokens.length;index++){var position=jexcel.getIdFromColumnName(tokens[index],1);position[0]+=colNumber;position[1]+=rowNumber;if(position[1]<0){position[1]=0;}
var token=jexcel.getColumnNameFromId([position[0],position[1]]);if(token!=tokens[index]){affectedTokens[tokens[index]]=token;}}
if(affectedTokens){value=obj.updateFormula(value,affectedTokens)}}}else{if(value==Number(value)){value=Number(value)+rowNumber;}}}else if(obj.options.columns[i].type=='calendar'){var date=new Date(value);date.setDate(date.getDate()+rowNumber);value=date.getFullYear()+'-'+jexcel.doubleDigitFormat(parseInt(date.getMonth()+1))+'-'+jexcel.doubleDigitFormat(date.getDate())+' '+'00:00:00';}}
records.push(obj.updateCell(i,j,value));obj.updateFormulaChain(i,j,records);}
posx++;if(h[0]!=x1){colNumber++;}}
posy++;rowNumber++;}
obj.setHistory({action:'setValue',records:records,selection:obj.selectedCell,});obj.updateTable();obj.onafterchanges(el,records);}
obj.refreshSelection=function(){if(obj.selectedCell){obj.updateSelectionFromCoords(obj.selectedCell[0],obj.selectedCell[1],obj.selectedCell[2],obj.selectedCell[3]);}}
obj.conditionalSelectionUpdate=function(type,o,d){if(type==1){if(obj.selectedCell&&((o>=obj.selectedCell[1]&&o<=obj.selectedCell[3])||(d>=obj.selectedCell[1]&&d<=obj.selectedCell[3]))){obj.resetSelection();return;}}else{if(obj.selectedCell&&((o>=obj.selectedCell[0]&&o<=obj.selectedCell[2])||(d>=obj.selectedCell[0]&&d<=obj.selectedCell[2]))){obj.resetSelection();return;}}}
obj.resetSelection=function(blur){if(!obj.highlighted.length){var previousStatus=0;}else{var previousStatus=1;for(var i=0;i<obj.highlighted.length;i++){obj.highlighted[i].classList.remove('highlight');obj.highlighted[i].classList.remove('highlight-left');obj.highlighted[i].classList.remove('highlight-right');obj.highlighted[i].classList.remove('highlight-top');obj.highlighted[i].classList.remove('highlight-bottom');obj.highlighted[i].classList.remove('highlight-selected');var px=parseInt(obj.highlighted[i].getAttribute('data-x'));var py=parseInt(obj.highlighted[i].getAttribute('data-y'));if(obj.highlighted[i].getAttribute('data-merged')){var colspan=parseInt(obj.highlighted[i].getAttribute('colspan'));var rowspan=parseInt(obj.highlighted[i].getAttribute('rowspan'));var ux=colspan>0?px+(colspan-1):px;var uy=rowspan>0?py+(rowspan-1):py;}else{var ux=px;var uy=py;}
for(var j=px;j<=ux;j++){if(obj.headers[j]){obj.headers[j].classList.remove('selected');}}
for(var j=py;j<=uy;j++){if(obj.rows[j]){obj.rows[j].classList.remove('selected');}}}}
obj.highlighted=[];obj.selectedCell=null;obj.corner.style.top='-2000px';obj.corner.style.left='-2000px';if(blur==true&&previousStatus==1){obj.dispatch('onblur',el);}
return previousStatus;}
obj.updateSelection=function(el1,el2,origin){var x1=el1.getAttribute('data-x');var y1=el1.getAttribute('data-y');if(el2){var x2=el2.getAttribute('data-x');var y2=el2.getAttribute('data-y');}else{var x2=x1;var y2=y1;}
obj.updateSelectionFromCoords(x1,y1,x2,y2,origin);}
obj.updateSelectionFromCoords=function(x1,y1,x2,y2,origin){var updated=null;var previousState=obj.resetSelection();if(y1==null){y1=0;y2=obj.rows.length-1;}
if(x2==null){x2=x1;}
if(y2==null){y2=y1;}
if(x1>=obj.headers.length){x1=obj.headers.length-1;}
if(y1>=obj.rows.length){y1=obj.rows.length-1;}
if(x2>=obj.headers.length){x2=obj.headers.length-1;}
if(y2>=obj.rows.length){y2=obj.rows.length-1;}
obj.selectedCell=[x1,y1,x2,y2];if(x1!=null){if(obj.records[y1][x1]){obj.records[y1][x1].classList.add('highlight-selected');}
if(parseInt(x1)<parseInt(x2)){var px=parseInt(x1);var ux=parseInt(x2);}else{var px=parseInt(x2);var ux=parseInt(x1);}
if(parseInt(y1)<parseInt(y2)){var py=parseInt(y1);var uy=parseInt(y2);}else{var py=parseInt(y2);var uy=parseInt(y1);}
for(var i=px;i<=ux;i++){for(var j=py;j<=uy;j++){if(obj.records[j][i]&&obj.records[j][i].getAttribute('data-merged')){var x=parseInt(obj.records[j][i].getAttribute('data-x'));var y=parseInt(obj.records[j][i].getAttribute('data-y'));var colspan=parseInt(obj.records[j][i].getAttribute('colspan'));var rowspan=parseInt(obj.records[j][i].getAttribute('rowspan'));if(colspan>1){if(x<px){px=x;}
if(x+colspan>ux){ux=x+colspan-1;}}
if(rowspan){if(y<py){py=y;}
if(y+rowspan>uy){uy=y+rowspan-1;}}}}}
var borderLeft=null;var borderRight=null;var borderTop=null;var borderBottom=null;for(var j=py;j<=uy;j++){if(obj.rows[j].style.display!='none'){if(borderTop==null){borderTop=j;}
borderBottom=j;}}
for(var i=px;i<=ux;i++){for(var j=py;j<=uy;j++){if(obj.rows[j].style.display!='none'&&obj.records[j][i].style.display!='none'){obj.records[j][i].classList.add('highlight');obj.highlighted.push(obj.records[j][i]);}}
if(obj.options.columns[i].type!='hidden'){if(borderLeft==null){borderLeft=i;}
borderRight=i;}}
if(!borderLeft){borderLeft=0;}
if(!borderRight){borderRight=0;}
for(var i=borderLeft;i<=borderRight;i++){if(obj.options.columns[i].type!='hidden'){if(obj.records[borderTop]&&obj.records[borderTop][i]){obj.records[borderTop][i].classList.add('highlight-top');}
if(obj.records[borderBottom]&&obj.records[borderBottom][i]){obj.records[borderBottom][i].classList.add('highlight-bottom');}
obj.headers[i].classList.add('selected');}}
for(var j=borderTop;j<=borderBottom;j++){if(obj.rows[j]&&obj.rows[j].style.display!='none'){obj.records[j][borderLeft].classList.add('highlight-left');obj.records[j][borderRight].classList.add('highlight-right');obj.rows[j].classList.add('selected');}}
obj.selectedContainer=[borderLeft,borderTop,borderRight,borderBottom];}
if(previousState==0){obj.dispatch('onfocus',el);obj.removeCopyingSelection();}
obj.dispatch('onselection',el,borderLeft,borderTop,borderRight,borderBottom,origin);obj.updateCornerPosition();}
obj.removeCopySelection=function(){for(var i=0;i<obj.selection.length;i++){obj.selection[i].classList.remove('selection');obj.selection[i].classList.remove('selection-left');obj.selection[i].classList.remove('selection-right');obj.selection[i].classList.remove('selection-top');obj.selection[i].classList.remove('selection-bottom');}
obj.selection=[];}
obj.updateCopySelection=function(x3,y3){obj.removeCopySelection();var x1=obj.selectedContainer[0];var y1=obj.selectedContainer[1];var x2=obj.selectedContainer[2];var y2=obj.selectedContainer[3];if(x3!=null&&y3!=null){if(x3-x2>0){var px=parseInt(x2)+1;var ux=parseInt(x3);}else{var px=parseInt(x3);var ux=parseInt(x1)-1;}
if(y3-y2>0){var py=parseInt(y2)+1;var uy=parseInt(y3);}else{var py=parseInt(y3);var uy=parseInt(y1)-1;}
if(ux-px<=uy-py){var px=parseInt(x1);var ux=parseInt(x2);}else{var py=parseInt(y1);var uy=parseInt(y2);}
for(var j=py;j<=uy;j++){for(var i=px;i<=ux;i++){if(obj.records[j][i]&&obj.rows[j].style.display!='none'&&obj.records[j][i].style.display!='none'){obj.records[j][i].classList.add('selection');obj.records[py][i].classList.add('selection-top');obj.records[uy][i].classList.add('selection-bottom');obj.records[j][px].classList.add('selection-left');obj.records[j][ux].classList.add('selection-right');obj.selection.push(obj.records[j][i]);}}}}}
obj.updateCornerPosition=function(){if(!obj.highlighted.length){obj.corner.style.top='-2000px';obj.corner.style.left='-2000px';}else{var last=obj.highlighted[obj.highlighted.length-1];var lastX=last.getAttribute('data-x');var contentRect=obj.content.getBoundingClientRect();var x1=contentRect.left;var y1=contentRect.top;var lastRect=last.getBoundingClientRect();var x2=lastRect.left;var y2=lastRect.top;var w2=lastRect.width;var h2=lastRect.height;var x=(x2-x1)+obj.content.scrollLeft+w2-4;var y=(y2-y1)+obj.content.scrollTop+h2-4;obj.corner.style.top=y+'px';obj.corner.style.left=x+'px';if(obj.options.freezeColumns){var width=obj.getFreezeWidth();if(lastX>obj.options.freezeColumns-1&&x2-x1+w2<width){obj.corner.style.display='none';}else{if(obj.options.selectionCopy==true){obj.corner.style.display='';}}}else{if(obj.options.selectionCopy==true){obj.corner.style.display='';}}}}
obj.updateScroll=function(direction){var contentRect=obj.content.getBoundingClientRect();var x1=contentRect.left;var y1=contentRect.top;var w1=contentRect.width;var h1=contentRect.height;var reference=obj.records[obj.selectedCell[3]][obj.selectedCell[2]];var referenceRect=reference.getBoundingClientRect();var x2=referenceRect.left;var y2=referenceRect.top;var w2=referenceRect.width;var h2=referenceRect.height;if(direction==0||direction==1){var x=(x2-x1)+obj.content.scrollLeft;var y=(y2-y1)+obj.content.scrollTop-2;}else{var x=(x2-x1)+obj.content.scrollLeft+w2;var y=(y2-y1)+obj.content.scrollTop+h2;}
if(y>(obj.content.scrollTop+30)&&y<(obj.content.scrollTop+h1)){}else{if(y<obj.content.scrollTop+30){obj.content.scrollTop=y-h2;}else{obj.content.scrollTop=y-(h1-2);}}
var freezed=obj.getFreezeWidth();if(x>(obj.content.scrollLeft+freezed)&&x<(obj.content.scrollLeft+w1)){}else{if(x<obj.content.scrollLeft+30){obj.content.scrollLeft=x;if(obj.content.scrollLeft<50){obj.content.scrollLeft=0;}}else if(x<obj.content.scrollLeft+freezed){obj.content.scrollLeft=x-freezed-1;}else{obj.content.scrollLeft=x-(w1-20);}}}
obj.getWidth=function(column){if(!column){var data=[];for(var i=0;i<obj.headers.length;i++){data.push(obj.options.columns[i].width);}}else{if(typeof(column)=='object'){column=$(column).getAttribute('data-x');}
data=obj.colgroup[column].getAttribute('width')}
return data;}
obj.setWidth=function(column,width,oldWidth){if(width){if(Array.isArray(column)){if(!oldWidth){var oldWidth=[];}
for(var i=0;i<column.length;i++){if(!oldWidth[i]){oldWidth[i]=obj.colgroup[column[i]].getAttribute('width');}
var w=Array.isArray(width)&&width[i]?width[i]:width;obj.colgroup[column[i]].setAttribute('width',w);obj.options.columns[column[i]].width=w;}}else{if(!oldWidth){oldWidth=obj.colgroup[column].getAttribute('width');}
obj.colgroup[column].setAttribute('width',width);obj.options.columns[column].width=width;}
obj.setHistory({action:'setWidth',column:column,oldValue:oldWidth,newValue:width,});obj.dispatch('onresizecolumn',el,column,width,oldWidth);obj.updateCornerPosition();}}
obj.setHeight=function(row,height,oldHeight){if(height>0){if(typeof(row)=='object'){row=row.getAttribute('data-y');}
if(!oldHeight){oldHeight=obj.rows[row].getAttribute('height');if(!oldHeight){var rect=obj.rows[row].getBoundingClientRect();oldHeight=rect.height;}}
height=parseInt(height);obj.rows[row].style.height=height+'px';if(!obj.options.rows[row]){obj.options.rows[row]={};}
obj.options.rows[row].height=height;obj.setHistory({action:'setHeight',row:row,oldValue:oldHeight,newValue:height,});obj.dispatch('onresizerow',el,row,height,oldHeight);obj.updateCornerPosition();}}
obj.getHeight=function(row){if(!row){var data=[];for(var j=0;j<obj.rows.length;j++){var h=obj.rows[j].style.height;if(h){data[j]=h;}}}else{if(typeof(row)=='object'){row=$(row).getAttribute('data-y');}
var data=obj.rows[row].style.height;}
return data;}
obj.setFooter=function(data){if(data){obj.options.footers=data;}
if(obj.options.footers){if(!obj.tfoot){obj.tfoot=document.createElement('tfoot');obj.table.appendChild(obj.tfoot);}
for(var j=0;j<obj.options.footers.length;j++){if(obj.tfoot.children[j]){var tr=obj.tfoot.children[j];}else{var tr=document.createElement('tr');var td=document.createElement('td');tr.appendChild(td);obj.tfoot.appendChild(tr);}
for(var i=0;i<obj.headers.length;i++){if(!obj.options.footers[j][i]){obj.options.footers[j][i]='';}
if(obj.tfoot.children[j].children[i+1]){var td=obj.tfoot.children[j].children[i+1];}else{var td=document.createElement('td');tr.appendChild(td);var colAlign=obj.options.columns[i].align?obj.options.columns[i].align:'center';td.style.textAlign=colAlign;}
td.innerText=obj.parseValue(+obj.records.length+i,j,obj.options.footers[j][i]);}}}}
obj.getHeader=function(column){return obj.headers[column].innerText;}
obj.setHeader=function(column,newValue){if(obj.headers[column]){var oldValue=obj.headers[column].innerText;if(!newValue){newValue=prompt(obj.options.text.columnName,oldValue)}
if(newValue){obj.headers[column].innerText=newValue;obj.headers[column].setAttribute('title',newValue);obj.options.columns[column].title=newValue;}
obj.setHistory({action:'setHeader',column:column,oldValue:oldValue,newValue:newValue});obj.dispatch('onchangeheader',el,column,oldValue,newValue);}}
obj.getHeaders=function(asArray){var title=[];for(var i=0;i<obj.headers.length;i++){title.push(obj.getHeader(i));}
return asArray?title:title.join(obj.options.csvDelimiter);}
obj.getMeta=function(cell,key){if(!cell){return obj.options.meta;}else{if(key){return obj.options.meta[cell]&&obj.options.meta[cell][key]?obj.options.meta[cell][key]:null;}else{return obj.options.meta[cell]?obj.options.meta[cell]:null;}}}
obj.setMeta=function(o,k,v){if(!obj.options.meta){obj.options.meta={}}
if(k&&v){if(!obj.options.meta[o]){obj.options.meta[o]={};}
obj.options.meta[o][k]=v;}else{var keys=Object.keys(o);for(var i=0;i<keys.length;i++){if(!obj.options.meta[keys[i]]){obj.options.meta[keys[i]]={};}
var prop=Object.keys(o[keys[i]]);for(var j=0;j<prop.length;j++){obj.options.meta[keys[i]][prop[j]]=o[keys[i]][prop[j]];}}}
obj.dispatch('onchangemeta',el,o,k,v);}
obj.updateMeta=function(affectedCells){if(obj.options.meta){var newMeta={};var keys=Object.keys(obj.options.meta);for(var i=0;i<keys.length;i++){if(affectedCells[keys[i]]){newMeta[affectedCells[keys[i]]]=obj.options.meta[keys[i]];}else{newMeta[keys[i]]=obj.options.meta[keys[i]];}}
obj.options.meta=newMeta;}}
obj.getStyle=function(cell,key){if(!cell){var data={};var x=obj.options.data[0].length;var y=obj.options.data.length;for(var j=0;j<y;j++){for(var i=0;i<x;i++){var v=key?obj.records[j][i].style[key]:obj.records[j][i].getAttribute('style');if(v){var k=jexcel.getColumnNameFromId([i,j]);data[k]=v;}}}
return data;}else{cell=jexcel.getIdFromColumnName(cell,true);return key?obj.records[cell[1]][cell[0]].style[key]:obj.records[cell[1]][cell[0]].getAttribute('style');}},obj.resetStyle=function(o,ignoreHistoryAndEvents){var keys=Object.keys(o);for(var i=0;i<keys.length;i++){var cell=jexcel.getIdFromColumnName(keys[i],true);if(obj.records[cell[1]]&&obj.records[cell[1]][cell[0]]){obj.records[cell[1]][cell[0]].setAttribute('style','');}}
obj.setStyle(o,null,null,null,ignoreHistoryAndEvents);}
obj.setStyle=function(o,k,v,force,ignoreHistoryAndEvents){var newValue={};var oldValue={};var applyStyle=function(cellId,key,value){var cell=jexcel.getIdFromColumnName(cellId,true);if(obj.records[cell[1]]&&obj.records[cell[1]][cell[0]]&&(obj.records[cell[1]][cell[0]].classList.contains('readonly')==false||force)){var currentValue=obj.records[cell[1]][cell[0]].style[key];if(currentValue==value&&!force){value='';obj.records[cell[1]][cell[0]].style[key]='';}else{obj.records[cell[1]][cell[0]].style[key]=value;}
if(!oldValue[cellId]){oldValue[cellId]=[];}
if(!newValue[cellId]){newValue[cellId]=[];}
oldValue[cellId].push([key+':'+currentValue]);newValue[cellId].push([key+':'+value]);}}
if(k&&v){if(typeof(o)=='string'){applyStyle(o,k,v);}else{var oneApplication=[];for(var i=0;i<o.length;i++){var x=o[i].getAttribute('data-x');var y=o[i].getAttribute('data-y');var cellName=jexcel.getColumnNameFromId([x,y]);if(!oneApplication[cellName]){applyStyle(cellName,k,v);oneApplication[cellName]=true;}}}}else{var keys=Object.keys(o);for(var i=0;i<keys.length;i++){var style=o[keys[i]];if(typeof(style)=='string'){style=style.split(';');}
for(var j=0;j<style.length;j++){if(typeof(style[j])=='string'){style[j]=style[j].split(':');}
if(style[j][0].trim()){applyStyle(keys[i],style[j][0].trim(),style[j][1]);}}}}
var keys=Object.keys(oldValue);for(var i=0;i<keys.length;i++){oldValue[keys[i]]=oldValue[keys[i]].join(';');}
var keys=Object.keys(newValue);for(var i=0;i<keys.length;i++){newValue[keys[i]]=newValue[keys[i]].join(';');}
if(!ignoreHistoryAndEvents){obj.setHistory({action:'setStyle',oldValue:oldValue,newValue:newValue,});}
obj.dispatch('onchangestyle',el,o,k,v);}
obj.getComments=function(cell,withAuthor){if(cell){if(typeof(cell)=='string'){var cell=jexcel.getIdFromColumnName(cell,true);}
if(withAuthor){return[obj.records[cell[1]][cell[0]].getAttribute('title'),obj.records[cell[1]][cell[0]].getAttribute('author')];}else{return obj.records[cell[1]][cell[0]].getAttribute('title')||'';}}else{var data={};for(var j=0;j<obj.options.data.length;j++){for(var i=0;i<obj.options.columns.length;i++){var comments=obj.records[j][i].getAttribute('title');if(comments){var cell=jexcel.getColumnNameFromId([i,j]);data[cell]=comments;}}}
return data;}}
obj.setComments=function(cellId,comments,author){if(typeof(cellId)=='string'){var cell=jexcel.getIdFromColumnName(cellId,true);}else{var cell=cellId;}
var title=obj.records[cell[1]][cell[0]].getAttribute('title');var author=obj.records[cell[1]][cell[0]].getAttribute('data-author');var oldValue=[title,author];obj.records[cell[1]][cell[0]].setAttribute('title',comments?comments:'');obj.records[cell[1]][cell[0]].setAttribute('data-author',author?author:'');if(comments){obj.records[cell[1]][cell[0]].classList.add('jexcel_comments');}else{obj.records[cell[1]][cell[0]].classList.remove('jexcel_comments');}
obj.setHistory({action:'setComments',column:cellId,newValue:[comments,author],oldValue:oldValue,});obj.dispatch('oncomments',el,comments,title,cell,cell[0],cell[1]);}
obj.getConfig=function(){var options=obj.options;options.style=obj.getStyle();options.mergeCells=obj.getMerge();options.comments=obj.getComments();return options;}
obj.orderBy=function(column,order){if(column>=0){if(Object.keys(obj.options.mergeCells).length>0){if(!confirm(obj.options.text.thisActionWillDestroyAnyExistingMergedCellsAreYouSure)){return false;}else{obj.destroyMerged();}}
if(order==null){order=obj.headers[column].classList.contains('arrow-down')?1:0;}else{order=order?1:0;}
var temp=[];if(obj.options.columns[column].type=='number'||obj.options.columns[column].type=='percentage'||obj.options.columns[column].type=='autonumber'||obj.options.columns[column].type=='color'){for(var j=0;j<obj.options.data.length;j++){temp[j]=[j,Number(obj.options.data[j][column])];}}else if(obj.options.columns[column].type=='calendar'||obj.options.columns[column].type=='checkbox'||obj.options.columns[column].type=='radio'){for(var j=0;j<obj.options.data.length;j++){temp[j]=[j,obj.options.data[j][column]];}}else{for(var j=0;j<obj.options.data.length;j++){temp[j]=[j,obj.records[j][column].innerText.toLowerCase()];}}
if(typeof(obj.options.sorting)!=='function'){obj.options.sorting=function(direction){return function(a,b){var valueA=a[1];var valueB=b[1];if(!direction){return(valueA===''&&valueB!=='')?1:(valueA!==''&&valueB==='')?-1:(valueA>valueB)?1:(valueA<valueB)?-1:0;}else{return(valueA===''&&valueB!=='')?1:(valueA!==''&&valueB==='')?-1:(valueA>valueB)?-1:(valueA<valueB)?1:0;}}}}
temp=temp.sort(obj.options.sorting(order));var newValue=[];for(var j=0;j<temp.length;j++){newValue[j]=temp[j][0];}
obj.setHistory({action:'orderBy',rows:newValue,column:column,order:order,});obj.updateOrderArrow(column,order);obj.updateOrder(newValue);obj.dispatch('onsort',el,column,order);return true;}}
obj.updateOrderArrow=function(column,order){for(var i=0;i<obj.headers.length;i++){obj.headers[i].classList.remove('arrow-up');obj.headers[i].classList.remove('arrow-down');}
if(order){obj.headers[column].classList.add('arrow-up');}else{obj.headers[column].classList.add('arrow-down');}}
obj.updateOrder=function(rows){var data=[]
for(var j=0;j<rows.length;j++){data[j]=obj.options.data[rows[j]];}
obj.options.data=data;var data=[]
for(var j=0;j<rows.length;j++){data[j]=obj.records[rows[j]];}
obj.records=data;var data=[]
for(var j=0;j<rows.length;j++){data[j]=obj.rows[rows[j]];}
obj.rows=data;obj.updateTableReferences();if(obj.results&&obj.results.length){if(obj.searchInput.value){obj.search(obj.searchInput.value);}else{obj.closeFilter();}}else{obj.results=null;obj.pageNumber=0;if(obj.options.pagination>0){obj.page(0);}else if(obj.options.lazyLoading==true){obj.loadPage(0);}else{for(var j=0;j<obj.rows.length;j++){obj.tbody.appendChild(obj.rows[j]);}}}}
obj.moveRow=function(o,d,ignoreDom){if(Object.keys(obj.options.mergeCells).length>0){if(o>d){var insertBefore=1;}else{var insertBefore=0;}
if(obj.isRowMerged(o).length||obj.isRowMerged(d,insertBefore).length){if(!confirm(obj.options.text.thisActionWillDestroyAnyExistingMergedCellsAreYouSure)){return false;}else{obj.destroyMerged();}}}
if(obj.options.search==true){if(obj.results&&obj.results.length!=obj.rows.length){if(confirm(obj.options.text.thisActionWillClearYourSearchResultsAreYouSure)){obj.resetSearch();}else{return false;}}
obj.results=null;}
if(!ignoreDom){if(Array.prototype.indexOf.call(obj.tbody.children,obj.rows[d])>=0){if(o>d){obj.tbody.insertBefore(obj.rows[o],obj.rows[d]);}else{obj.tbody.insertBefore(obj.rows[o],obj.rows[d].nextSibling);}}else{obj.tbody.removeChild(obj.rows[o]);}}
obj.rows.splice(d,0,obj.rows.splice(o,1)[0]);obj.records.splice(d,0,obj.records.splice(o,1)[0]);obj.options.data.splice(d,0,obj.options.data.splice(o,1)[0]);if(obj.options.pagination>0&&obj.tbody.children.length!=obj.options.pagination){obj.page(obj.pageNumber);}
obj.setHistory({action:'moveRow',oldValue:o,newValue:d,});obj.updateTableReferences();obj.dispatch('onmoverow',el,o,d);}
obj.insertRow=function(mixed,rowNumber,insertBefore){if(obj.options.allowInsertRow==true){var records=[];var data=[];if(mixed>0){var numOfRows=mixed;}else{var numOfRows=1;if(mixed){data=mixed;}}
var insertBefore=insertBefore?true:false;var lastRow=obj.options.data.length-1;if(rowNumber==undefined||rowNumber>=parseInt(lastRow)||rowNumber<0){rowNumber=lastRow;}
if(obj.dispatch('onbeforeinsertrow',el,rowNumber,numOfRows,insertBefore)===false){return false;}
if(Object.keys(obj.options.mergeCells).length>0){if(obj.isRowMerged(rowNumber,insertBefore).length){if(!confirm(obj.options.text.thisActionWillDestroyAnyExistingMergedCellsAreYouSure)){return false;}else{obj.destroyMerged();}}}
if(obj.options.search==true){if(obj.results&&obj.results.length!=obj.rows.length){if(confirm(obj.options.text.thisActionWillClearYourSearchResultsAreYouSure)){obj.resetSearch();}else{return false;}}
obj.results=null;}
var rowIndex=(!insertBefore)?rowNumber+1:rowNumber;var currentRecords=obj.records.splice(rowIndex);var currentData=obj.options.data.splice(rowIndex);var currentRows=obj.rows.splice(rowIndex);var rowRecords=[];var rowData=[];var rowNode=[];for(var row=rowIndex;row<(numOfRows+rowIndex);row++){obj.options.data[row]=[];for(var col=0;col<obj.options.columns.length;col++){obj.options.data[row][col]=data[col]?data[col]:'';}
var tr=obj.createRow(row,obj.options.data[row]);if(currentRows[0]){if(Array.prototype.indexOf.call(obj.tbody.children,currentRows[0])>=0){obj.tbody.insertBefore(tr,currentRows[0]);}}else{if(Array.prototype.indexOf.call(obj.tbody.children,obj.rows[rowNumber])>=0){obj.tbody.appendChild(tr);}}
rowRecords.push(obj.records[row]);rowData.push(obj.options.data[row]);rowNode.push(tr);}
Array.prototype.push.apply(obj.records,currentRecords);Array.prototype.push.apply(obj.options.data,currentData);Array.prototype.push.apply(obj.rows,currentRows);if(obj.options.pagination>0){obj.page(obj.pageNumber);}
obj.setHistory({action:'insertRow',rowNumber:rowNumber,numOfRows:numOfRows,insertBefore:insertBefore,rowRecords:rowRecords,rowData:rowData,rowNode:rowNode,});obj.updateTableReferences();obj.dispatch('oninsertrow',el,rowNumber,numOfRows,rowRecords,insertBefore);}}
obj.deleteRow=function(rowNumber,numOfRows){if(obj.options.allowDeleteRow==true){if(obj.options.allowDeletingAllRows==true||obj.options.data.length>1){if(rowNumber==undefined){var number=obj.getSelectedRows();if(!number[0]){rowNumber=obj.options.data.length-1;numOfRows=1;}else{rowNumber=parseInt(number[0].getAttribute('data-y'));numOfRows=number.length;}}
var lastRow=obj.options.data.length-1;if(rowNumber==undefined||rowNumber>lastRow||rowNumber<0){rowNumber=lastRow;}
if(!numOfRows){numOfRows=1;}
if(rowNumber+numOfRows>=obj.options.data.length){numOfRows=obj.options.data.length-rowNumber;}
if(obj.dispatch('onbeforedeleterow',el,rowNumber,numOfRows)===false){return false;}
if(parseInt(rowNumber)>-1){var mergeExists=false;if(Object.keys(obj.options.mergeCells).length>0){for(var row=rowNumber;row<rowNumber+numOfRows;row++){if(obj.isRowMerged(row,false).length){mergeExists=true;}}}
if(mergeExists){if(!confirm(obj.options.text.thisActionWillDestroyAnyExistingMergedCellsAreYouSure)){return false;}else{obj.destroyMerged();}}
if(obj.options.search==true){if(obj.results&&obj.results.length!=obj.rows.length){if(confirm(obj.options.text.thisActionWillClearYourSearchResultsAreYouSure)){obj.resetSearch();}else{return false;}}
obj.results=null;}
if(obj.options.allowDeletingAllRows==false&&lastRow+1===numOfRows){numOfRows--;console.error('Jspreadsheet: It is not possible to delete the last row');}
for(var row=rowNumber;row<rowNumber+numOfRows;row++){if(Array.prototype.indexOf.call(obj.tbody.children,obj.rows[row])>=0){obj.rows[row].className='';obj.rows[row].parentNode.removeChild(obj.rows[row]);}}
var rowRecords=obj.records.splice(rowNumber,numOfRows);var rowData=obj.options.data.splice(rowNumber,numOfRows);var rowNode=obj.rows.splice(rowNumber,numOfRows);if(obj.options.pagination>0&&obj.tbody.children.length!=obj.options.pagination){obj.page(obj.pageNumber);}
obj.conditionalSelectionUpdate(1,rowNumber,(rowNumber+numOfRows)-1);obj.setHistory({action:'deleteRow',rowNumber:rowNumber,numOfRows:numOfRows,insertBefore:1,rowRecords:rowRecords,rowData:rowData,rowNode:rowNode});obj.updateTableReferences();obj.dispatch('ondeleterow',el,rowNumber,numOfRows,rowRecords);}}else{console.error('Jspreadsheet: It is not possible to delete the last row');}}}
obj.moveColumn=function(o,d){if(Object.keys(obj.options.mergeCells).length>0){if(o>d){var insertBefore=1;}else{var insertBefore=0;}
if(obj.isColMerged(o).length||obj.isColMerged(d,insertBefore).length){if(!confirm(obj.options.text.thisActionWillDestroyAnyExistingMergedCellsAreYouSure)){return false;}else{obj.destroyMerged();}}}
var o=parseInt(o);var d=parseInt(d);if(o>d){obj.headerContainer.insertBefore(obj.headers[o],obj.headers[d]);obj.colgroupContainer.insertBefore(obj.colgroup[o],obj.colgroup[d]);for(var j=0;j<obj.rows.length;j++){obj.rows[j].insertBefore(obj.records[j][o],obj.records[j][d]);}}else{obj.headerContainer.insertBefore(obj.headers[o],obj.headers[d].nextSibling);obj.colgroupContainer.insertBefore(obj.colgroup[o],obj.colgroup[d].nextSibling);for(var j=0;j<obj.rows.length;j++){obj.rows[j].insertBefore(obj.records[j][o],obj.records[j][d].nextSibling);}}
obj.options.columns.splice(d,0,obj.options.columns.splice(o,1)[0]);obj.headers.splice(d,0,obj.headers.splice(o,1)[0]);obj.colgroup.splice(d,0,obj.colgroup.splice(o,1)[0]);for(var j=0;j<obj.rows.length;j++){obj.options.data[j].splice(d,0,obj.options.data[j].splice(o,1)[0]);obj.records[j].splice(d,0,obj.records[j].splice(o,1)[0]);}
if(obj.options.footers){for(var j=0;j<obj.options.footers.length;j++){obj.options.footers[j].splice(d,0,obj.options.footers[j].splice(o,1)[0]);}}
obj.setHistory({action:'moveColumn',oldValue:o,newValue:d,});obj.updateTableReferences();obj.dispatch('onmovecolumn',el,o,d);}
obj.insertColumn=function(mixed,columnNumber,insertBefore,properties){if(obj.options.allowInsertColumn==true){var records=[];var data=[];if(mixed>0){var numOfColumns=mixed;}else{var numOfColumns=1;if(mixed){data=mixed;}}
var insertBefore=insertBefore?true:false;var lastColumn=obj.options.columns.length-1;if(columnNumber==undefined||columnNumber>=parseInt(lastColumn)||columnNumber<0){columnNumber=lastColumn;}
if(obj.dispatch('onbeforeinsertcolumn',el,columnNumber,numOfColumns,insertBefore)===false){return false;}
if(Object.keys(obj.options.mergeCells).length>0){if(obj.isColMerged(columnNumber,insertBefore).length){if(!confirm(obj.options.text.thisActionWillDestroyAnyExistingMergedCellsAreYouSure)){return false;}else{obj.destroyMerged();}}}
if(!properties){properties=[];}
for(var i=0;i<numOfColumns;i++){if(!properties[i]){properties[i]={type:'text',source:[],options:[],width:obj.options.defaultColWidth,align:obj.options.defaultColAlign};}}
var columnIndex=(!insertBefore)?columnNumber+1:columnNumber;obj.options.columns=jexcel.injectArray(obj.options.columns,columnIndex,properties);var currentHeaders=obj.headers.splice(columnIndex);var currentColgroup=obj.colgroup.splice(columnIndex);var historyHeaders=[];var historyColgroup=[];var historyRecords=[];var historyData=[];var historyFooters=[];for(var col=columnIndex;col<(numOfColumns+columnIndex);col++){obj.createCellHeader(col);obj.headerContainer.insertBefore(obj.headers[col],obj.headerContainer.children[col+1]);obj.colgroupContainer.insertBefore(obj.colgroup[col],obj.colgroupContainer.children[col+1]);historyHeaders.push(obj.headers[col]);historyColgroup.push(obj.colgroup[col]);}
if(obj.options.footers){for(var j=0;j<obj.options.footers.length;j++){historyFooters[j]=[];for(var i=0;i<numOfColumns;i++){historyFooters[j].push('');}
obj.options.footers[j].splice(columnIndex,0,historyFooters[j]);}}
for(var row=0;row<obj.options.data.length;row++){var currentData=obj.options.data[row].splice(columnIndex);var currentRecord=obj.records[row].splice(columnIndex);historyData[row]=[];historyRecords[row]=[];for(var col=columnIndex;col<(numOfColumns+columnIndex);col++){var value=data[row]?data[row]:'';obj.options.data[row][col]=value;var td=obj.createCell(col,row,obj.options.data[row][col]);obj.records[row][col]=td;if(obj.rows[row]){obj.rows[row].insertBefore(td,obj.rows[row].children[col+1]);}
historyData[row].push(value);historyRecords[row].push(td);}
Array.prototype.push.apply(obj.options.data[row],currentData);Array.prototype.push.apply(obj.records[row],currentRecord);}
Array.prototype.push.apply(obj.headers,currentHeaders);Array.prototype.push.apply(obj.colgroup,currentColgroup);if(obj.options.nestedHeaders&&obj.options.nestedHeaders.length>0){if(obj.options.nestedHeaders[0]&&obj.options.nestedHeaders[0][0]){for(var j=0;j<obj.options.nestedHeaders.length;j++){var colspan=parseInt(obj.options.nestedHeaders[j][obj.options.nestedHeaders[j].length-1].colspan)+numOfColumns;obj.options.nestedHeaders[j][obj.options.nestedHeaders[j].length-1].colspan=colspan;obj.thead.children[j].children[obj.thead.children[j].children.length-1].setAttribute('colspan',colspan);var o=obj.thead.children[j].children[obj.thead.children[j].children.length-1].getAttribute('data-column');o=o.split(',');for(var col=columnIndex;col<(numOfColumns+columnIndex);col++){o.push(col);}
obj.thead.children[j].children[obj.thead.children[j].children.length-1].setAttribute('data-column',o);}}else{var colspan=parseInt(obj.options.nestedHeaders[0].colspan)+numOfColumns;obj.options.nestedHeaders[0].colspan=colspan;obj.thead.children[0].children[obj.thead.children[0].children.length-1].setAttribute('colspan',colspan);}}
obj.setHistory({action:'insertColumn',columnNumber:columnNumber,numOfColumns:numOfColumns,insertBefore:insertBefore,columns:properties,headers:historyHeaders,colgroup:historyColgroup,records:historyRecords,footers:historyFooters,data:historyData,});obj.updateTableReferences();obj.dispatch('oninsertcolumn',el,columnNumber,numOfColumns,historyRecords,insertBefore);}}
obj.deleteColumn=function(columnNumber,numOfColumns){if(obj.options.allowDeleteColumn==true){if(obj.headers.length>1){if(columnNumber==undefined){var number=obj.getSelectedColumns(true);if(!number.length){columnNumber=obj.headers.length-1;numOfColumns=1;}else{columnNumber=parseInt(number[0]);numOfColumns=parseInt(number.length);}}
var lastColumn=obj.options.data[0].length-1;if(columnNumber==undefined||columnNumber>lastColumn||columnNumber<0){columnNumber=lastColumn;}
if(!numOfColumns){numOfColumns=1;}
if(numOfColumns>obj.options.data[0].length-columnNumber){numOfColumns=obj.options.data[0].length-columnNumber;}
if(obj.dispatch('onbeforedeletecolumn',el,columnNumber,numOfColumns)===false){return false;}
if(parseInt(columnNumber)>-1){var mergeExists=false;if(Object.keys(obj.options.mergeCells).length>0){for(var col=columnNumber;col<columnNumber+numOfColumns;col++){if(obj.isColMerged(col,false).length){mergeExists=true;}}}
if(mergeExists){if(!confirm(obj.options.text.thisActionWillDestroyAnyExistingMergedCellsAreYouSure)){return false;}else{obj.destroyMerged();}}
var columns=obj.options.columns.splice(columnNumber,numOfColumns);for(var col=columnNumber;col<columnNumber+numOfColumns;col++){obj.colgroup[col].className='';obj.headers[col].className='';obj.colgroup[col].parentNode.removeChild(obj.colgroup[col]);obj.headers[col].parentNode.removeChild(obj.headers[col]);}
var historyHeaders=obj.headers.splice(columnNumber,numOfColumns);var historyColgroup=obj.colgroup.splice(columnNumber,numOfColumns);var historyRecords=[];var historyData=[];var historyFooters=[];for(var row=0;row<obj.options.data.length;row++){for(var col=columnNumber;col<columnNumber+numOfColumns;col++){obj.records[row][col].className='';obj.records[row][col].parentNode.removeChild(obj.records[row][col]);}}
for(var row=0;row<obj.options.data.length;row++){historyData[row]=obj.options.data[row].splice(columnNumber,numOfColumns);historyRecords[row]=obj.records[row].splice(columnNumber,numOfColumns);}
if(obj.options.footers){for(var row=0;row<obj.options.footers.length;row++){historyFooters[row]=obj.options.footers[row].splice(columnNumber,numOfColumns);}}
obj.conditionalSelectionUpdate(0,columnNumber,(columnNumber+numOfColumns)-1);if(obj.options.nestedHeaders&&obj.options.nestedHeaders.length>0){if(obj.options.nestedHeaders[0]&&obj.options.nestedHeaders[0][0]){for(var j=0;j<obj.options.nestedHeaders.length;j++){var colspan=parseInt(obj.options.nestedHeaders[j][obj.options.nestedHeaders[j].length-1].colspan)-numOfColumns;obj.options.nestedHeaders[j][obj.options.nestedHeaders[j].length-1].colspan=colspan;obj.thead.children[j].children[obj.thead.children[j].children.length-1].setAttribute('colspan',colspan);}}else{var colspan=parseInt(obj.options.nestedHeaders[0].colspan)-numOfColumns;obj.options.nestedHeaders[0].colspan=colspan;obj.thead.children[0].children[obj.thead.children[0].children.length-1].setAttribute('colspan',colspan);}}
obj.setHistory({action:'deleteColumn',columnNumber:columnNumber,numOfColumns:numOfColumns,insertBefore:1,columns:columns,headers:historyHeaders,colgroup:historyColgroup,records:historyRecords,footers:historyFooters,data:historyData,});obj.updateTableReferences();obj.dispatch('ondeletecolumn',el,columnNumber,numOfColumns,historyRecords);}}else{console.error('Jspreadsheet: It is not possible to delete the last column');}}}
obj.getSelectedRows=function(asIds){var rows=[];for(var j=0;j<obj.rows.length;j++){if(obj.rows[j].classList.contains('selected')){if(asIds){rows.push(j);}else{rows.push(obj.rows[j]);}}}
return rows;},obj.getSelectedColumns=function(){var cols=[];for(var i=0;i<obj.headers.length;i++){if(obj.headers[i].classList.contains('selected')){cols.push(i);}}
return cols;}
obj.getHighlighted=function(){return obj.highlighted;}
obj.updateTableReferences=function(){for(var i=0;i<obj.headers.length;i++){var x=obj.headers[i].getAttribute('data-x');if(x!=i){obj.headers[i].setAttribute('data-x',i);if(!obj.headers[i].getAttribute('title')){obj.headers[i].innerHTML=jexcel.getColumnName(i);}}}
for(var j=0;j<obj.rows.length;j++){if(obj.rows[j]){var y=obj.rows[j].getAttribute('data-y');if(y!=j){obj.rows[j].setAttribute('data-y',j);obj.rows[j].children[0].setAttribute('data-y',j);obj.rows[j].children[0].innerHTML=j+1;}}}
var affectedTokens=[];var mergeCellUpdates=[];var updatePosition=function(x,y,i,j){if(x!=i){obj.records[j][i].setAttribute('data-x',i);}
if(y!=j){obj.records[j][i].setAttribute('data-y',j);}
if(x!=i||y!=j){var columnIdFrom=jexcel.getColumnNameFromId([x,y]);var columnIdTo=jexcel.getColumnNameFromId([i,j]);affectedTokens[columnIdFrom]=columnIdTo;}}
for(var j=0;j<obj.records.length;j++){for(var i=0;i<obj.records[0].length;i++){if(obj.records[j][i]){var x=obj.records[j][i].getAttribute('data-x');var y=obj.records[j][i].getAttribute('data-y');if(obj.records[j][i].getAttribute('data-merged')){var columnIdFrom=jexcel.getColumnNameFromId([x,y]);var columnIdTo=jexcel.getColumnNameFromId([i,j]);if(mergeCellUpdates[columnIdFrom]==null){if(columnIdFrom==columnIdTo){mergeCellUpdates[columnIdFrom]=false;}else{var totalX=parseInt(i-x);var totalY=parseInt(j-y);mergeCellUpdates[columnIdFrom]=[columnIdTo,totalX,totalY];}}}else{updatePosition(x,y,i,j);}}}}
var keys=Object.keys(mergeCellUpdates);if(keys.length){for(var i=0;i<keys.length;i++){if(mergeCellUpdates[keys[i]]){var info=jexcel.getIdFromColumnName(keys[i],true)
var x=info[0];var y=info[1];updatePosition(x,y,x+mergeCellUpdates[keys[i]][1],y+mergeCellUpdates[keys[i]][2]);var columnIdFrom=keys[i];var columnIdTo=mergeCellUpdates[keys[i]][0];for(var j=0;j<obj.options.mergeCells[columnIdFrom][2].length;j++){var x=parseInt(obj.options.mergeCells[columnIdFrom][2][j].getAttribute('data-x'));var y=parseInt(obj.options.mergeCells[columnIdFrom][2][j].getAttribute('data-y'));obj.options.mergeCells[columnIdFrom][2][j].setAttribute('data-x',x+mergeCellUpdates[keys[i]][1]);obj.options.mergeCells[columnIdFrom][2][j].setAttribute('data-y',y+mergeCellUpdates[keys[i]][2]);}
obj.options.mergeCells[columnIdTo]=obj.options.mergeCells[columnIdFrom];delete(obj.options.mergeCells[columnIdFrom]);}}}
obj.updateFormulas(affectedTokens);obj.updateMeta(affectedTokens);obj.refreshSelection();obj.updateTable();}
obj.updateTable=function(){if(obj.options.minSpareRows>0){var numBlankRows=0;for(var j=obj.rows.length-1;j>=0;j--){var test=false;for(var i=0;i<obj.headers.length;i++){if(obj.options.data[j][i]){test=true;}}
if(test){break;}else{numBlankRows++;}}
if(obj.options.minSpareRows-numBlankRows>0){obj.insertRow(obj.options.minSpareRows-numBlankRows)}}
if(obj.options.minSpareCols>0){var numBlankCols=0;for(var i=obj.headers.length-1;i>=0;i--){var test=false;for(var j=0;j<obj.rows.length;j++){if(obj.options.data[j][i]){test=true;}}
if(test){break;}else{numBlankCols++;}}
if(obj.options.minSpareCols-numBlankCols>0){obj.insertColumn(obj.options.minSpareCols-numBlankCols)}}
if(typeof(obj.options.updateTable)=='function'){if(obj.options.detachForUpdates){el.removeChild(obj.content);}
for(var j=0;j<obj.rows.length;j++){for(var i=0;i<obj.headers.length;i++){obj.options.updateTable(el,obj.records[j][i],i,j,obj.options.data[j][i],obj.records[j][i].innerText,jexcel.getColumnNameFromId([i,j]));}}
if(obj.options.detachForUpdates){el.insertBefore(obj.content,obj.pagination);}}
if(obj.options.footers){obj.setFooter();}
setTimeout(function(){obj.updateCornerPosition();},0);}
obj.isReadOnly=function(cell){if(cell=obj.getCell(cell)){return cell.classList.contains('readonly')?true:false;}}
obj.setReadOnly=function(cell,state){if(cell=obj.getCell(cell)){if(state){cell.classList.add('readonly');}else{cell.classList.remove('readonly');}}}
obj.showRow=function(rowNumber){obj.rows[rowNumber].style.display='';}
obj.hideRow=function(rowNumber){obj.rows[rowNumber].style.display='none';}
obj.showColumn=function(colNumber){obj.headers[colNumber].style.display='';obj.colgroup[colNumber].style.display='';if(obj.filter&&obj.filter.children.length>colNumber+1){obj.filter.children[colNumber+1].style.display='';}
for(var j=0;j<obj.options.data.length;j++){obj.records[j][colNumber].style.display='';}
obj.resetSelection();}
obj.hideColumn=function(colNumber){obj.headers[colNumber].style.display='none';obj.colgroup[colNumber].style.display='none';if(obj.filter&&obj.filter.children.length>colNumber+1){obj.filter.children[colNumber+1].style.display='none';}
for(var j=0;j<obj.options.data.length;j++){obj.records[j][colNumber].style.display='none';}
obj.resetSelection();}
obj.showIndex=function(){obj.table.classList.remove('jexcel_hidden_index');}
obj.hideIndex=function(){obj.table.classList.add('jexcel_hidden_index');}
var chainLoopProtection=[];obj.updateFormulaChain=function(x,y,records){var cellId=jexcel.getColumnNameFromId([x,y]);if(obj.formula[cellId]&&obj.formula[cellId].length>0){if(chainLoopProtection[cellId]){obj.records[y][x].innerHTML='#ERROR';obj.formula[cellId]='';}else{chainLoopProtection[cellId]=true;for(var i=0;i<obj.formula[cellId].length;i++){var cell=jexcel.getIdFromColumnName(obj.formula[cellId][i],true);var value=''+obj.options.data[cell[1]][cell[0]];if(value.substr(0,1)=='='){records.push(obj.updateCell(cell[0],cell[1],value,true));}else{Object.keys(obj.formula)[i]=null;}
obj.updateFormulaChain(cell[0],cell[1],records);}}}
chainLoopProtection=[];}
obj.updateFormulas=function(referencesToUpdate){for(var j=0;j<obj.options.data.length;j++){for(var i=0;i<obj.options.data[0].length;i++){var value=''+obj.options.data[j][i];if(value.substr(0,1)=='='){var newFormula=obj.updateFormula(value,referencesToUpdate);if(newFormula!=value){obj.options.data[j][i]=newFormula;}}}}
var formula=[];var keys=Object.keys(obj.formula);for(var j=0;j<keys.length;j++){var key=keys[j];var value=obj.formula[key];if(referencesToUpdate[key]){key=referencesToUpdate[key];}
formula[key]=[];for(var i=0;i<value.length;i++){var letter=value[i];if(referencesToUpdate[letter]){letter=referencesToUpdate[letter];}
formula[key].push(letter);}}
obj.formula=formula;}
obj.updateFormula=function(formula,referencesToUpdate){var testLetter=/[A-Z]/;var testNumber=/[0-9]/;var newFormula='';var letter=null;var number=null;var token='';for(var index=0;index<formula.length;index++){if(testLetter.exec(formula[index])){letter=1;number=0;token+=formula[index];}else if(testNumber.exec(formula[index])){number=letter?1:0;token+=formula[index];}else{if(letter&&number){token=referencesToUpdate[token]?referencesToUpdate[token]:token;}
newFormula+=token;newFormula+=formula[index];letter=0;number=0;token='';}}
if(token){if(letter&&number){token=referencesToUpdate[token]?referencesToUpdate[token]:token;}
newFormula+=token;}
return newFormula;}
var secureFormula=function(oldValue){var newValue='';var inside=0;for(var i=0;i<oldValue.length;i++){if(oldValue[i]=='"'){if(inside==0){inside=1;}else{inside=0;}}
if(inside==1){newValue+=oldValue[i];}else{newValue+=oldValue[i].toUpperCase();}}
return newValue;}
obj.executeFormula=function(expression,x,y){var formulaResults=[];var formulaLoopProtection=[];var execute=function(expression,x,y){var parentId=jexcel.getColumnNameFromId([x,y]);if(formulaLoopProtection[parentId]){console.error('Reference loop detected');return '#ERROR';}
formulaLoopProtection[parentId]=true;var tokensUpdate=function(tokens){for(var index=0;index<tokens.length;index++){var f=[];var token=tokens[index].split(':');var e1=jexcel.getIdFromColumnName(token[0],true);var e2=jexcel.getIdFromColumnName(token[1],true);if(e1[0]<=e2[0]){var x1=e1[0];var x2=e2[0];}else{var x1=e2[0];var x2=e1[0];}
if(e1[1]<=e2[1]){var y1=e1[1];var y2=e2[1];}else{var y1=e2[1];var y2=e1[1];}
for(var j=y1;j<=y2;j++){for(var i=x1;i<=x2;i++){f.push(jexcel.getColumnNameFromId([i,j]));}}
expression=expression.replace(tokens[index],f.join(','));}}
expression=expression.replace(/\$?([A-Z]+)\$?([0-9]+)/g,"$1$2");var tokens=expression.match(/([A-Z]+[0-9]+)\:([A-Z]+[0-9]+)/g);if(tokens&&tokens.length){tokensUpdate(tokens);}
var tokens=expression.match(/([A-Z]+[0-9]+)/g);if(tokens&&tokens.indexOf(parentId)>-1){console.error('Self Reference detected');return '#ERROR';}else{var formulaExpressions={};if(tokens){for(var i=0;i<tokens.length;i++){if(!obj.formula[tokens[i]]){obj.formula[tokens[i]]=[];}
if(obj.formula[tokens[i]].indexOf(parentId)<0){obj.formula[tokens[i]].push(parentId);}
if(eval('typeof('+tokens[i]+') == "undefined"')){var position=jexcel.getIdFromColumnName(tokens[i],1);if(typeof(obj.options.data[position[1]])!='undefined'&&typeof(obj.options.data[position[1]][position[0]])!='undefined'){var value=obj.options.data[position[1]][position[0]];}else{var value='';}
if((''+value).substr(0,1)=='='){if(formulaResults[tokens[i]]){value=formulaResults[tokens[i]];}else{value=execute(value,position[0],position[1]);formulaResults[tokens[i]]=value;}}
if((''+value).trim()==''){formulaExpressions[tokens[i]]=null;}else{if(value==Number(value)&&obj.options.autoCasting==true){formulaExpressions[tokens[i]]=Number(value);}else{var number=obj.parseNumber(value,position[0])
if(obj.options.autoCasting==true&&number){formulaExpressions[tokens[i]]=number;}else{formulaExpressions[tokens[i]]='"'+value+'"';}}}}}}
try{var res=jexcel.formula(expression.substr(1),formulaExpressions,x,y,obj);}catch(e){var res='#ERROR';console.log(e)}
return res;}}
return execute(expression,x,y);}
obj.parseNumber=function(value,columnNumber){var decimal=columnNumber&&obj.options.columns[columnNumber].decimal?obj.options.columns[columnNumber].decimal:'.';var number=(''+value);number=number.split(decimal);number[0]=number[0].match(/[+-]?[0-9]/g);if(number[0]){number[0]=number[0].join('');}
if(number[1]){number[1]=number[1].match(/[0-9]*/g).join('');}
if(number[0]&&Number(number[0])>=0){if(!number[1]){var value=Number(number[0]+'.00');}else{var value=Number(number[0]+'.'+number[1]);}}else{var value=null;}
return value;}
obj.row=function(cell){}
obj.col=function(cell){}
obj.up=function(shiftKey,ctrlKey){if(shiftKey){if(obj.selectedCell[3]>0){obj.up.visible(1,ctrlKey?0:1)}}else{if(obj.selectedCell[1]>0){obj.up.visible(0,ctrlKey?0:1)}
obj.selectedCell[2]=obj.selectedCell[0];obj.selectedCell[3]=obj.selectedCell[1];}
obj.updateSelectionFromCoords(obj.selectedCell[0],obj.selectedCell[1],obj.selectedCell[2],obj.selectedCell[3]);if(obj.options.lazyLoading==true){if(obj.selectedCell[1]==0||obj.selectedCell[3]==0){obj.loadPage(0);obj.updateSelectionFromCoords(obj.selectedCell[0],obj.selectedCell[1],obj.selectedCell[2],obj.selectedCell[3]);}else{if(obj.loadValidation()){obj.updateSelectionFromCoords(obj.selectedCell[0],obj.selectedCell[1],obj.selectedCell[2],obj.selectedCell[3]);}else{var item=parseInt(obj.tbody.firstChild.getAttribute('data-y'));if(obj.selectedCell[1]-item<30){obj.loadUp();obj.updateSelectionFromCoords(obj.selectedCell[0],obj.selectedCell[1],obj.selectedCell[2],obj.selectedCell[3]);}}}}else if(obj.options.pagination>0){var pageNumber=obj.whichPage(obj.selectedCell[3]);if(pageNumber!=obj.pageNumber){obj.page(pageNumber);}}
obj.updateScroll(1);}
obj.up.visible=function(group,direction){if(group==0){var x=parseInt(obj.selectedCell[0]);var y=parseInt(obj.selectedCell[1]);}else{var x=parseInt(obj.selectedCell[2]);var y=parseInt(obj.selectedCell[3]);}
if(direction==0){for(var j=0;j<y;j++){if(obj.records[j][x].style.display!='none'&&obj.rows[j].style.display!='none'){y=j;break;}}}else{y=obj.up.get(x,y);}
if(group==0){obj.selectedCell[0]=x;obj.selectedCell[1]=y;}else{obj.selectedCell[2]=x;obj.selectedCell[3]=y;}}
obj.up.get=function(x,y){var x=parseInt(x);var y=parseInt(y);for(var j=(y-1);j>=0;j--){if(obj.records[j][x].style.display!='none'&&obj.rows[j].style.display!='none'){if(obj.records[j][x].getAttribute('data-merged')){if(obj.records[j][x]==obj.records[y][x]){continue;}}
y=j;break;}}
return y;}
obj.down=function(shiftKey,ctrlKey){if(shiftKey){if(obj.selectedCell[3]<obj.records.length-1){obj.down.visible(1,ctrlKey?0:1)}}else{if(obj.selectedCell[1]<obj.records.length-1){obj.down.visible(0,ctrlKey?0:1)}
obj.selectedCell[2]=obj.selectedCell[0];obj.selectedCell[3]=obj.selectedCell[1];}
obj.updateSelectionFromCoords(obj.selectedCell[0],obj.selectedCell[1],obj.selectedCell[2],obj.selectedCell[3]);if(obj.options.lazyLoading==true){if((obj.selectedCell[1]==obj.records.length-1||obj.selectedCell[3]==obj.records.length-1)){obj.loadPage(-1);obj.updateSelectionFromCoords(obj.selectedCell[0],obj.selectedCell[1],obj.selectedCell[2],obj.selectedCell[3]);}else{if(obj.loadValidation()){obj.updateSelectionFromCoords(obj.selectedCell[0],obj.selectedCell[1],obj.selectedCell[2],obj.selectedCell[3]);}else{var item=parseInt(obj.tbody.lastChild.getAttribute('data-y'));if(item-obj.selectedCell[3]<30){obj.loadDown();obj.updateSelectionFromCoords(obj.selectedCell[0],obj.selectedCell[1],obj.selectedCell[2],obj.selectedCell[3]);}}}}else if(obj.options.pagination>0){var pageNumber=obj.whichPage(obj.selectedCell[3]);if(pageNumber!=obj.pageNumber){obj.page(pageNumber);}}
obj.updateScroll(3);}
obj.down.visible=function(group,direction){if(group==0){var x=parseInt(obj.selectedCell[0]);var y=parseInt(obj.selectedCell[1]);}else{var x=parseInt(obj.selectedCell[2]);var y=parseInt(obj.selectedCell[3]);}
if(direction==0){for(var j=obj.rows.length-1;j>y;j--){if(obj.records[j][x].style.display!='none'&&obj.rows[j].style.display!='none'){y=j;break;}}}else{y=obj.down.get(x,y);}
if(group==0){obj.selectedCell[0]=x;obj.selectedCell[1]=y;}else{obj.selectedCell[2]=x;obj.selectedCell[3]=y;}}
obj.down.get=function(x,y){var x=parseInt(x);var y=parseInt(y);for(var j=(y+1);j<obj.rows.length;j++){if(obj.records[j][x].style.display!='none'&&obj.rows[j].style.display!='none'){if(obj.records[j][x].getAttribute('data-merged')){if(obj.records[j][x]==obj.records[y][x]){continue;}}
y=j;break;}}
return y;}
obj.right=function(shiftKey,ctrlKey){if(shiftKey){if(obj.selectedCell[2]<obj.headers.length-1){obj.right.visible(1,ctrlKey?0:1)}}else{if(obj.selectedCell[0]<obj.headers.length-1){obj.right.visible(0,ctrlKey?0:1)}
obj.selectedCell[2]=obj.selectedCell[0];obj.selectedCell[3]=obj.selectedCell[1];}
obj.updateSelectionFromCoords(obj.selectedCell[0],obj.selectedCell[1],obj.selectedCell[2],obj.selectedCell[3]);obj.updateScroll(2);}
obj.right.visible=function(group,direction){if(group==0){var x=parseInt(obj.selectedCell[0]);var y=parseInt(obj.selectedCell[1]);}else{var x=parseInt(obj.selectedCell[2]);var y=parseInt(obj.selectedCell[3]);}
if(direction==0){for(var i=obj.headers.length-1;i>x;i--){if(obj.records[y][i].style.display!='none'){x=i;break;}}}else{x=obj.right.get(x,y);}
if(group==0){obj.selectedCell[0]=x;obj.selectedCell[1]=y;}else{obj.selectedCell[2]=x;obj.selectedCell[3]=y;}}
obj.right.get=function(x,y){var x=parseInt(x);var y=parseInt(y);for(var i=(x+1);i<obj.headers.length;i++){if(obj.records[y][i].style.display!='none'){if(obj.records[y][i].getAttribute('data-merged')){if(obj.records[y][i]==obj.records[y][x]){continue;}}
x=i;break;}}
return x;}
obj.left=function(shiftKey,ctrlKey){if(shiftKey){if(obj.selectedCell[2]>0){obj.left.visible(1,ctrlKey?0:1)}}else{if(obj.selectedCell[0]>0){obj.left.visible(0,ctrlKey?0:1)}
obj.selectedCell[2]=obj.selectedCell[0];obj.selectedCell[3]=obj.selectedCell[1];}
obj.updateSelectionFromCoords(obj.selectedCell[0],obj.selectedCell[1],obj.selectedCell[2],obj.selectedCell[3]);obj.updateScroll(0);}
obj.left.visible=function(group,direction){if(group==0){var x=parseInt(obj.selectedCell[0]);var y=parseInt(obj.selectedCell[1]);}else{var x=parseInt(obj.selectedCell[2]);var y=parseInt(obj.selectedCell[3]);}
if(direction==0){for(var i=0;i<x;i++){if(obj.records[y][i].style.display!='none'){x=i;break;}}}else{x=obj.left.get(x,y);}
if(group==0){obj.selectedCell[0]=x;obj.selectedCell[1]=y;}else{obj.selectedCell[2]=x;obj.selectedCell[3]=y;}}
obj.left.get=function(x,y){var x=parseInt(x);var y=parseInt(y);for(var i=(x-1);i>=0;i--){if(obj.records[y][i].style.display!='none'){if(obj.records[y][i].getAttribute('data-merged')){if(obj.records[y][i]==obj.records[y][x]){continue;}}
x=i;break;}}
return x;}
obj.first=function(shiftKey,ctrlKey){if(shiftKey){if(ctrlKey){obj.selectedCell[3]=0;}else{obj.left.visible(1,0);}}else{if(ctrlKey){obj.selectedCell[1]=0;}else{obj.left.visible(0,0);}
obj.selectedCell[2]=obj.selectedCell[0];obj.selectedCell[3]=obj.selectedCell[1];}
if(obj.options.lazyLoading==true&&(obj.selectedCell[1]==0||obj.selectedCell[3]==0)){obj.loadPage(0);}else if(obj.options.pagination>0){var pageNumber=obj.whichPage(obj.selectedCell[3]);if(pageNumber!=obj.pageNumber){obj.page(pageNumber);}}
obj.updateSelectionFromCoords(obj.selectedCell[0],obj.selectedCell[1],obj.selectedCell[2],obj.selectedCell[3]);obj.updateScroll(1);}
obj.last=function(shiftKey,ctrlKey){if(shiftKey){if(ctrlKey){obj.selectedCell[3]=obj.records.length-1;}else{obj.right.visible(1,0);}}else{if(ctrlKey){obj.selectedCell[1]=obj.records.length-1;}else{obj.right.visible(0,0);}
obj.selectedCell[2]=obj.selectedCell[0];obj.selectedCell[3]=obj.selectedCell[1];}
if(obj.options.lazyLoading==true&&(obj.selectedCell[1]==obj.records.length-1||obj.selectedCell[3]==obj.records.length-1)){obj.loadPage(-1);}else if(obj.options.pagination>0){var pageNumber=obj.whichPage(obj.selectedCell[3]);if(pageNumber!=obj.pageNumber){obj.page(pageNumber);}}
obj.updateSelectionFromCoords(obj.selectedCell[0],obj.selectedCell[1],obj.selectedCell[2],obj.selectedCell[3]);obj.updateScroll(3);}
obj.selectAll=function(){if(!obj.selectedCell){obj.selectedCell=[];}
obj.selectedCell[0]=0;obj.selectedCell[1]=0;obj.selectedCell[2]=obj.headers.length-1;obj.selectedCell[3]=obj.records.length-1;obj.updateSelectionFromCoords(obj.selectedCell[0],obj.selectedCell[1],obj.selectedCell[2],obj.selectedCell[3]);}
obj.loadPage=function(pageNumber){if(obj.options.search==true&&obj.results){var results=obj.results;}else{var results=obj.rows;}
var quantityPerPage=100;if(pageNumber==null||pageNumber==-1){pageNumber=Math.ceil(results.length/quantityPerPage)-1;}
var startRow=(pageNumber*quantityPerPage);var finalRow=(pageNumber*quantityPerPage)+quantityPerPage;if(finalRow>results.length){finalRow=results.length;}
startRow=finalRow-100;if(startRow<0){startRow=0;}
for(var j=startRow;j<finalRow;j++){if(obj.options.search==true&&obj.results){obj.tbody.appendChild(obj.rows[results[j]]);}else{obj.tbody.appendChild(obj.rows[j]);}
if(obj.tbody.children.length>quantityPerPage){obj.tbody.removeChild(obj.tbody.firstChild);}}}
obj.loadUp=function(){if(obj.options.search==true&&obj.results){var results=obj.results;}else{var results=obj.rows;}
var test=0;if(results.length>100){var item=parseInt(obj.tbody.firstChild.getAttribute('data-y'));if(obj.options.search==true&&obj.results){item=results.indexOf(item);}
if(item>0){for(var j=0;j<30;j++){item=item-1;if(item>-1){if(obj.options.search==true&&obj.results){obj.tbody.insertBefore(obj.rows[results[item]],obj.tbody.firstChild);}else{obj.tbody.insertBefore(obj.rows[item],obj.tbody.firstChild);}
if(obj.tbody.children.length>100){obj.tbody.removeChild(obj.tbody.lastChild);test=1;}}}}}
return test;}
obj.loadDown=function(){if(obj.options.search==true&&obj.results){var results=obj.results;}else{var results=obj.rows;}
var test=0;if(results.length>100){var item=parseInt(obj.tbody.lastChild.getAttribute('data-y'));if(obj.options.search==true&&obj.results){item=results.indexOf(item);}
if(item<obj.rows.length-1){for(var j=0;j<=30;j++){if(item<results.length){if(obj.options.search==true&&obj.results){obj.tbody.appendChild(obj.rows[results[item]]);}else{obj.tbody.appendChild(obj.rows[item]);}
if(obj.tbody.children.length>100){obj.tbody.removeChild(obj.tbody.firstChild);test=1;}}
item=item+1;}}}
return test;}
obj.loadValidation=function(){if(obj.selectedCell){var currentPage=parseInt(obj.tbody.firstChild.getAttribute('data-y'))/100;var selectedPage=parseInt(obj.selectedCell[3]/100);var totalPages=parseInt(obj.rows.length/100);if(currentPage!=selectedPage&&selectedPage<=totalPages){if(!Array.prototype.indexOf.call(obj.tbody.children,obj.rows[obj.selectedCell[3]])){obj.loadPage(selectedPage);return true;}}}
return false;}
obj.resetSearch=function(){obj.searchInput.value='';obj.search('');obj.results=null;}
obj.search=function(query){if(query){var query=query.toLowerCase();}
if(obj.options.filters){obj.resetFilters();}
obj.resetSelection();obj.pageNumber=0;obj.results=[];if(query){var search=function(item,query,index){for(var i=0;i<item.length;i++){if((''+item[i]).toLowerCase().search(query)>=0||(''+obj.records[index][i].innerHTML).toLowerCase().search(query)>=0){return true;}}
return false;}
var addToResult=function(k){if(obj.results.indexOf(k)==-1){obj.results.push(k);}}
var data=obj.options.data.filter(function(v,k){if(search(v,query,k)){var rows=obj.isRowMerged(k);if(rows.length){for(var i=0;i<rows.length;i++){var row=jexcel.getIdFromColumnName(rows[i],true);for(var j=0;j<obj.options.mergeCells[rows[i]][1];j++){addToResult(row[1]+j);}}}else{addToResult(k);}
return true;}else{return false;}});}else{obj.results=null;}
return obj.updateResult();}
obj.updateResult=function(){var total=0;var index=0;if(obj.options.lazyLoading==true){total=100;}else if(obj.options.pagination>0){total=obj.options.pagination;}else{if(obj.results){total=obj.results.length;}else{total=obj.rows.length;}}
while(obj.tbody.firstChild){obj.tbody.removeChild(obj.tbody.firstChild);}
for(var j=0;j<obj.rows.length;j++){if(!obj.results||obj.results.indexOf(j)>-1){if(index<total){obj.tbody.appendChild(obj.rows[j]);index++;}
obj.rows[j].style.display='';}else{obj.rows[j].style.display='none';}}
if(obj.options.pagination>0){obj.updatePagination();}
obj.updateCornerPosition();return total;}
obj.whichPage=function(cell){if(obj.options.search==true&&obj.results){cell=obj.results.indexOf(cell);}
return(Math.ceil((parseInt(cell)+1)/parseInt(obj.options.pagination)))-1;}
obj.page=function(pageNumber){var oldPage=obj.pageNumber;if(obj.options.search==true&&obj.results){var results=obj.results;}else{var results=obj.rows;}
var quantityPerPage=parseInt(obj.options.pagination);if(pageNumber==null||pageNumber==-1){pageNumber=Math.ceil(results.length/quantityPerPage)-1;}
obj.pageNumber=pageNumber;var startRow=(pageNumber*quantityPerPage);var finalRow=(pageNumber*quantityPerPage)+quantityPerPage;if(finalRow>results.length){finalRow=results.length;}
if(startRow<0){startRow=0;}
while(obj.tbody.firstChild){obj.tbody.removeChild(obj.tbody.firstChild);}
for(var j=startRow;j<finalRow;j++){if(obj.options.search==true&&obj.results){obj.tbody.appendChild(obj.rows[results[j]]);}else{obj.tbody.appendChild(obj.rows[j]);}}
if(obj.options.pagination>0){obj.updatePagination();}
obj.updateCornerPosition();obj.dispatch('onchangepage',el,pageNumber,oldPage);}
obj.updatePagination=function(){obj.pagination.children[0].innerHTML='';obj.pagination.children[1].innerHTML='';if(obj.options.pagination){if(obj.options.search==true&&obj.results){var results=obj.results.length;}else{var results=obj.rows.length;}
if(!results){obj.pagination.children[0].innerHTML=obj.options.text.noRecordsFound;}else{var quantyOfPages=Math.ceil(results/obj.options.pagination);if(obj.pageNumber<6){var startNumber=1;var finalNumber=quantyOfPages<10?quantyOfPages:10;}else if(quantyOfPages-obj.pageNumber<5){var startNumber=quantyOfPages-9;var finalNumber=quantyOfPages;if(startNumber<1){startNumber=1;}}else{var startNumber=obj.pageNumber-4;var finalNumber=obj.pageNumber+5;}
if(startNumber>1){var paginationItem=document.createElement('div');paginationItem.className='jexcel_page';paginationItem.innerHTML='<';paginationItem.title=1;obj.pagination.children[1].appendChild(paginationItem);}
for(var i=startNumber;i<=finalNumber;i++){var paginationItem=document.createElement('div');paginationItem.className='jexcel_page';paginationItem.innerHTML=i;obj.pagination.children[1].appendChild(paginationItem);if(obj.pageNumber==(i-1)){paginationItem.classList.add('jexcel_page_selected');}}
if(finalNumber<quantyOfPages){var paginationItem=document.createElement('div');paginationItem.className='jexcel_page';paginationItem.innerHTML='>';paginationItem.title=quantyOfPages;obj.pagination.children[1].appendChild(paginationItem);}
var format=function(format){var args=Array.prototype.slice.call(arguments,1);return format.replace(/{(\d+)}/g,function(match,number){return typeof args[number]!='undefined'?args[number]:match;});};obj.pagination.children[0].innerHTML=format(obj.options.text.showingPage,obj.pageNumber+1,quantyOfPages)}}}
obj.download=function(includeHeaders){if(obj.options.allowExport==false){console.error('Export not allowed');}else{var data='';data+=obj.copy(false,obj.options.csvDelimiter,true,includeHeaders,true);var blob=new Blob(["\uFEFF"+data],{type:'text/csv;charset=utf-8;'});if(window.navigator&&window.navigator.msSaveOrOpenBlob){window.navigator.msSaveOrOpenBlob(blob,obj.options.csvFileName+'.csv');}else{var pom=document.createElement('a');var url=URL.createObjectURL(blob);pom.href=url;pom.setAttribute('download',obj.options.csvFileName+'.csv');document.body.appendChild(pom);pom.click();pom.parentNode.removeChild(pom);}}}
obj.setHistory=function(changes){if(obj.ignoreHistory!=true){var index=++obj.historyIndex;obj.history=(obj.history=obj.history.slice(0,index+1));obj.history[index]=changes;}}
obj.copy=function(highlighted,delimiter,returnData,includeHeaders,download){if(!delimiter){delimiter="\t";}
var div=new RegExp(delimiter,'ig');var header=[];var col=[];var colLabel=[];var row=[];var rowLabel=[];var x=obj.options.data[0].length;var y=obj.options.data.length;var tmp='';var copyHeader=false;var headers='';var nestedHeaders='';var numOfCols=0;var numOfRows=0;var copyX=0;var copyY=0;var isPartialCopy=true;for(var j=0;j<y;j++){for(var i=0;i<x;i++){if(!highlighted||obj.records[j][i].classList.contains('highlight')){if(copyX<=i){copyX=i;}
if(copyY<=j){copyY=j;}}}}
if(x===copyX+1&&y===copyY+1){isPartialCopy=false;}
if((download&&obj.options.includeHeadersOnDownload==true)||(!download&&obj.options.includeHeadersOnCopy==true&&!isPartialCopy)||(includeHeaders)){if(obj.options.nestedHeaders&&obj.options.nestedHeaders.length>0){if(!(obj.options.nestedHeaders[0]&&obj.options.nestedHeaders[0][0])){tmp=[obj.options.nestedHeaders];}else{tmp=obj.options.nestedHeaders;}
for(var j=0;j<tmp.length;j++){var nested=[];for(var i=0;i<tmp[j].length;i++){var colspan=parseInt(tmp[j][i].colspan);nested.push(tmp[j][i].title);for(var c=0;c<colspan-1;c++){nested.push('');}}
nestedHeaders+=nested.join(delimiter)+"\r\n";}}
copyHeader=true;}
obj.style=[];for(var j=0;j<y;j++){col=[];colLabel=[];for(var i=0;i<x;i++){if(!highlighted||obj.records[j][i].classList.contains('highlight')){if(copyHeader==true){header.push(obj.headers[i].innerText);}
var value=obj.options.data[j][i];if(value.match&&(value.match(div)||value.match(/,/g)||value.match(/\n/)||value.match(/\"/))){value=value.replace(new RegExp('"','g'),'""');value='"'+value+'"';}
col.push(value);if(obj.options.columns[i].type=='checkbox'||obj.options.columns[i].type=='radio'){var label=value;}else{if(obj.options.stripHTMLOnCopy==true){var label=obj.records[j][i].innerText;}else{var label=obj.records[j][i].innerHTML;}
if(label.match&&(label.match(div)||label.match(/,/g)||label.match(/\n/)||label.match(/\"/))){label=label.replace(new RegExp('"','g'),'""');label='"'+label+'"';}}
colLabel.push(label);tmp=obj.records[j][i].getAttribute('style');tmp=tmp.replace('display: none;','');obj.style.push(tmp?tmp:'');}}
if(col.length){if(copyHeader){numOfCols=col.length;row.push(header.join(delimiter));}
row.push(col.join(delimiter));}
if(colLabel.length){numOfRows++;if(copyHeader){rowLabel.push(header.join(delimiter));copyHeader=false;}
rowLabel.push(colLabel.join(delimiter));}}
if(x==numOfCols&&y==numOfRows){headers=nestedHeaders;}
var str=headers+row.join("\r\n");var strLabel=headers+rowLabel.join("\r\n");if(!returnData){if(obj.options.copyCompatibility==true){obj.textarea.value=strLabel;}else{obj.textarea.value=str;}
obj.textarea.select();document.execCommand("copy");}
if(obj.options.copyCompatibility==true){obj.data=strLabel;}else{obj.data=str;}
obj.hashString=obj.hash(obj.data);if(!returnData){obj.removeCopyingSelection();if(obj.highlighted){for(var i=0;i<obj.highlighted.length;i++){obj.highlighted[i].classList.add('copying');if(obj.highlighted[i].classList.contains('highlight-left')){obj.highlighted[i].classList.add('copying-left');}
if(obj.highlighted[i].classList.contains('highlight-right')){obj.highlighted[i].classList.add('copying-right');}
if(obj.highlighted[i].classList.contains('highlight-top')){obj.highlighted[i].classList.add('copying-top');}
if(obj.highlighted[i].classList.contains('highlight-bottom')){obj.highlighted[i].classList.add('copying-bottom');}}}
obj.dispatch('oncopy',el,obj.options.copyCompatibility==true?rowLabel:row,obj.hashString);}
return obj.data;}
obj.paste=function(x,y,data){var ret=obj.dispatch('onbeforepaste',el,data,x,y);if(ret===false){return false;}else if(ret){var data=ret;}
var hash=obj.hash(data);var style=(hash==obj.hashString)?obj.style:null;if(obj.options.copyCompatibility==true&&hash==obj.hashString){var data=obj.data;}
var data=obj.parseCSV(data,"\t");if(x!=null&&y!=null&&data){var i=0;var j=0;var records=[];var newStyle={};var oldStyle={};var styleIndex=0;var colIndex=parseInt(x);var rowIndex=parseInt(y);var row=null;while(row=data[j]){i=0;colIndex=parseInt(x);while(row[i]!=null){var record=obj.updateCell(colIndex,rowIndex,row[i]);records.push(record);obj.updateFormulaChain(colIndex,rowIndex,records);if(style&&style[styleIndex]){var columnName=jexcel.getColumnNameFromId([colIndex,rowIndex]);newStyle[columnName]=style[styleIndex];oldStyle[columnName]=obj.getStyle(columnName);obj.records[rowIndex][colIndex].setAttribute('style',style[styleIndex]);styleIndex++}
i++;if(row[i]!=null){if(colIndex>=obj.headers.length-1){if(obj.options.allowInsertColumn==true){obj.insertColumn();}else{break;}}
colIndex=obj.right.get(colIndex,rowIndex);}}
j++;if(data[j]){if(rowIndex>=obj.rows.length-1){if(obj.options.allowInsertRow==true){obj.insertRow();}else{break;}}
rowIndex=obj.down.get(x,rowIndex);}}
obj.updateSelectionFromCoords(x,y,colIndex,rowIndex);obj.setHistory({action:'setValue',records:records,selection:obj.selectedCell,newStyle:newStyle,oldStyle:oldStyle,});obj.updateTable();obj.dispatch('onpaste',el,data);obj.onafterchanges(el,records);}
obj.removeCopyingSelection();}
obj.removeCopyingSelection=function(){var copying=document.querySelectorAll('.jexcel .copying');for(var i=0;i<copying.length;i++){copying[i].classList.remove('copying');copying[i].classList.remove('copying-left');copying[i].classList.remove('copying-right');copying[i].classList.remove('copying-top');copying[i].classList.remove('copying-bottom');}}
obj.historyProcessRow=function(type,historyRecord){var rowIndex=(!historyRecord.insertBefore)?historyRecord.rowNumber+1:+historyRecord.rowNumber;if(obj.options.search==true){if(obj.results&&obj.results.length!=obj.rows.length){obj.resetSearch();}}
if(type==1){var numOfRows=historyRecord.numOfRows;for(var j=rowIndex;j<(numOfRows+rowIndex);j++){obj.rows[j].parentNode.removeChild(obj.rows[j]);}
obj.records.splice(rowIndex,numOfRows);obj.options.data.splice(rowIndex,numOfRows);obj.rows.splice(rowIndex,numOfRows);obj.conditionalSelectionUpdate(1,rowIndex,(numOfRows+rowIndex)-1);}else{obj.records=jexcel.injectArray(obj.records,rowIndex,historyRecord.rowRecords);obj.options.data=jexcel.injectArray(obj.options.data,rowIndex,historyRecord.rowData);obj.rows=jexcel.injectArray(obj.rows,rowIndex,historyRecord.rowNode);var index=0
for(var j=rowIndex;j<(historyRecord.numOfRows+rowIndex);j++){obj.tbody.insertBefore(historyRecord.rowNode[index],obj.tbody.children[j]);index++;}}
if(obj.options.pagination>0){obj.page(obj.pageNumber);}
obj.updateTableReferences();}
obj.historyProcessColumn=function(type,historyRecord){var columnIndex=(!historyRecord.insertBefore)?historyRecord.columnNumber+1:historyRecord.columnNumber;if(type==1){var numOfColumns=historyRecord.numOfColumns;obj.options.columns.splice(columnIndex,numOfColumns);for(var i=columnIndex;i<(numOfColumns+columnIndex);i++){obj.headers[i].parentNode.removeChild(obj.headers[i]);obj.colgroup[i].parentNode.removeChild(obj.colgroup[i]);}
obj.headers.splice(columnIndex,numOfColumns);obj.colgroup.splice(columnIndex,numOfColumns);for(var j=0;j<historyRecord.data.length;j++){for(var i=columnIndex;i<(numOfColumns+columnIndex);i++){obj.records[j][i].parentNode.removeChild(obj.records[j][i]);}
obj.records[j].splice(columnIndex,numOfColumns);obj.options.data[j].splice(columnIndex,numOfColumns);}
if(obj.options.footers){for(var j=0;j<obj.options.footers.length;j++){obj.options.footers[j].splice(columnIndex,numOfColumns);}}}else{obj.options.columns=jexcel.injectArray(obj.options.columns,columnIndex,historyRecord.columns);obj.headers=jexcel.injectArray(obj.headers,columnIndex,historyRecord.headers);obj.colgroup=jexcel.injectArray(obj.colgroup,columnIndex,historyRecord.colgroup);var index=0
for(var i=columnIndex;i<(historyRecord.numOfColumns+columnIndex);i++){obj.headerContainer.insertBefore(historyRecord.headers[index],obj.headerContainer.children[i+1]);obj.colgroupContainer.insertBefore(historyRecord.colgroup[index],obj.colgroupContainer.children[i+1]);index++;}
for(var j=0;j<historyRecord.data.length;j++){obj.options.data[j]=jexcel.injectArray(obj.options.data[j],columnIndex,historyRecord.data[j]);obj.records[j]=jexcel.injectArray(obj.records[j],columnIndex,historyRecord.records[j]);var index=0
for(var i=columnIndex;i<(historyRecord.numOfColumns+columnIndex);i++){obj.rows[j].insertBefore(historyRecord.records[j][index],obj.rows[j].children[i+1]);index++;}}
if(obj.options.footers){for(var j=0;j<obj.options.footers.length;j++){obj.options.footers[j]=jexcel.injectArray(obj.options.footers[j],columnIndex,historyRecord.footers[j]);}}}
if(obj.options.nestedHeaders&&obj.options.nestedHeaders.length>0){if(obj.options.nestedHeaders[0]&&obj.options.nestedHeaders[0][0]){for(var j=0;j<obj.options.nestedHeaders.length;j++){if(type==1){var colspan=parseInt(obj.options.nestedHeaders[j][obj.options.nestedHeaders[j].length-1].colspan)-historyRecord.numOfColumns;}else{var colspan=parseInt(obj.options.nestedHeaders[j][obj.options.nestedHeaders[j].length-1].colspan)+historyRecord.numOfColumns;}
obj.options.nestedHeaders[j][obj.options.nestedHeaders[j].length-1].colspan=colspan;obj.thead.children[j].children[obj.thead.children[j].children.length-1].setAttribute('colspan',colspan);}}else{if(type==1){var colspan=parseInt(obj.options.nestedHeaders[0].colspan)-historyRecord.numOfColumns;}else{var colspan=parseInt(obj.options.nestedHeaders[0].colspan)+historyRecord.numOfColumns;}
obj.options.nestedHeaders[0].colspan=colspan;obj.thead.children[0].children[obj.thead.children[0].children.length-1].setAttribute('colspan',colspan);}}
obj.updateTableReferences();}
obj.undo=function(){var ignoreEvents=obj.ignoreEvents?true:false;var ignoreHistory=obj.ignoreHistory?true:false;obj.ignoreEvents=true;obj.ignoreHistory=true;var records=[];if(obj.historyIndex>=0){var historyRecord=obj.history[obj.historyIndex--];if(historyRecord.action=='insertRow'){obj.historyProcessRow(1,historyRecord);}else if(historyRecord.action=='deleteRow'){obj.historyProcessRow(0,historyRecord);}else if(historyRecord.action=='insertColumn'){obj.historyProcessColumn(1,historyRecord);}else if(historyRecord.action=='deleteColumn'){obj.historyProcessColumn(0,historyRecord);}else if(historyRecord.action=='moveRow'){obj.moveRow(historyRecord.newValue,historyRecord.oldValue);}else if(historyRecord.action=='moveColumn'){obj.moveColumn(historyRecord.newValue,historyRecord.oldValue);}else if(historyRecord.action=='setMerge'){obj.removeMerge(historyRecord.column,historyRecord.data);}else if(historyRecord.action=='setStyle'){obj.setStyle(historyRecord.oldValue,null,null,1);}else if(historyRecord.action=='setWidth'){obj.setWidth(historyRecord.column,historyRecord.oldValue);}else if(historyRecord.action=='setHeight'){obj.setHeight(historyRecord.row,historyRecord.oldValue);}else if(historyRecord.action=='setHeader'){obj.setHeader(historyRecord.column,historyRecord.oldValue);}else if(historyRecord.action=='setComments'){obj.setComments(historyRecord.column,historyRecord.oldValue[0],historyRecord.oldValue[1]);}else if(historyRecord.action=='orderBy'){var rows=[];for(var j=0;j<historyRecord.rows.length;j++){rows[historyRecord.rows[j]]=j;}
obj.updateOrderArrow(historyRecord.column,historyRecord.order?0:1);obj.updateOrder(rows);}else if(historyRecord.action=='setValue'){for(var i=0;i<historyRecord.records.length;i++){records.push({x:historyRecord.records[i].x,y:historyRecord.records[i].y,newValue:historyRecord.records[i].oldValue,});if(historyRecord.oldStyle){obj.resetStyle(historyRecord.oldStyle);}}
obj.setValue(records);if(historyRecord.selection){obj.updateSelectionFromCoords(historyRecord.selection[0],historyRecord.selection[1],historyRecord.selection[2],historyRecord.selection[3]);}}}
obj.ignoreEvents=ignoreEvents;obj.ignoreHistory=ignoreHistory;obj.dispatch('onundo',el,historyRecord);}
obj.redo=function(){var ignoreEvents=obj.ignoreEvents?true:false;var ignoreHistory=obj.ignoreHistory?true:false;obj.ignoreEvents=true;obj.ignoreHistory=true;var records=[];if(obj.historyIndex<obj.history.length-1){var historyRecord=obj.history[++obj.historyIndex];if(historyRecord.action=='insertRow'){obj.historyProcessRow(0,historyRecord);}else if(historyRecord.action=='deleteRow'){obj.historyProcessRow(1,historyRecord);}else if(historyRecord.action=='insertColumn'){obj.historyProcessColumn(0,historyRecord);}else if(historyRecord.action=='deleteColumn'){obj.historyProcessColumn(1,historyRecord);}else if(historyRecord.action=='moveRow'){obj.moveRow(historyRecord.oldValue,historyRecord.newValue);}else if(historyRecord.action=='moveColumn'){obj.moveColumn(historyRecord.oldValue,historyRecord.newValue);}else if(historyRecord.action=='setMerge'){obj.setMerge(historyRecord.column,historyRecord.colspan,historyRecord.rowspan,1);}else if(historyRecord.action=='setStyle'){obj.setStyle(historyRecord.newValue,null,null,1);}else if(historyRecord.action=='setWidth'){obj.setWidth(historyRecord.column,historyRecord.newValue);}else if(historyRecord.action=='setHeight'){obj.setHeight(historyRecord.row,historyRecord.newValue);}else if(historyRecord.action=='setHeader'){obj.setHeader(historyRecord.column,historyRecord.newValue);}else if(historyRecord.action=='setComments'){obj.setComments(historyRecord.column,historyRecord.newValue[0],historyRecord.newValue[1]);}else if(historyRecord.action=='orderBy'){obj.updateOrderArrow(historyRecord.column,historyRecord.order);obj.updateOrder(historyRecord.rows);}else if(historyRecord.action=='setValue'){obj.setValue(historyRecord.records);for(var i=0;i<historyRecord.records.length;i++){if(historyRecord.oldStyle){obj.resetStyle(historyRecord.newStyle);}}
if(historyRecord.selection){obj.updateSelectionFromCoords(historyRecord.selection[0],historyRecord.selection[1],historyRecord.selection[2],historyRecord.selection[3]);}}}
obj.ignoreEvents=ignoreEvents;obj.ignoreHistory=ignoreHistory;obj.dispatch('onredo',el,historyRecord);}
obj.getDropDownValue=function(column,key){var value=[];if(obj.options.columns[column]&&obj.options.columns[column].source){var combo=[];var source=obj.options.columns[column].source;for(var i=0;i<source.length;i++){if(typeof(source[i])=='object'){combo[source[i].id]=source[i].name;}else{combo[source[i]]=source[i];}}
var keys=Array.isArray(key)?key:(''+key).split(';');for(var i=0;i<keys.length;i++){if(typeof(keys[i])==='object'){value.push(combo[keys[i].id]);}else{if(combo[keys[i]]){value.push(combo[keys[i]]);}}}}else{console.error('Invalid column');}
return(value.length>0)?value.join('; '):'';}
obj.parseCSV=function(str,delimiter){str=str.replace(/\r?\n$|\r$|\n$/g,"");if(str.charCodeAt(str.length-1)==9){str+="\0";}
delimiter=(delimiter||",");var arr=[];var quote=false;for(var row=0,col=0,c=0;c<str.length;c++){var cc=str[c],nc=str[c+1];arr[row]=arr[row]||[];arr[row][col]=arr[row][col]||'';if(cc=='"'&&quote&&nc=='"'){arr[row][col]+=cc;++c;continue;}
if(cc=='"'){quote=!quote;continue;}
if(cc==delimiter&&!quote){++col;continue;}
if(cc=='\r'&&nc=='\n'&&!quote){++row;col=0;++c;continue;}
if(cc=='\n'&&!quote){++row;col=0;continue;}
if(cc=='\r'&&!quote){++row;col=0;continue;}
arr[row][col]+=cc;}
return arr;}
obj.hash=function(str){var hash=0,i,chr;if(str.length===0){return hash;}else{for(i=0;i<str.length;i++){chr=str.charCodeAt(i);hash=((hash<<5)-hash)+chr;hash|=0;}}
return hash;}
obj.onafterchanges=function(el,records){obj.dispatch('onafterchanges',el,records);}
obj.destroy=function(){jexcel.destroy(el);}
obj.init=function(){jexcel.current=obj;if(typeof(jexcel.build)=='function'){if(obj.options.root){jexcel.build(obj.options.root);}else{jexcel.build(document);jexcel.build=null;}}
el.setAttribute('tabindex',1);el.addEventListener('focus',function(e){if(jexcel.current&&!obj.selectedCell){obj.updateSelectionFromCoords(0,0,0,0);obj.left();}});if(obj.options.csv){if(obj.options.loadingSpin==true){jSuites.loading.show();}
jSuites.ajax({url:obj.options.csv,method:obj.options.method,data:obj.options.requestVariables,dataType:'text',success:function(result){var newData=obj.parseCSV(result,obj.options.csvDelimiter)
if(obj.options.csvHeaders==true&&newData.length>0){var headers=newData.shift();for(var i=0;i<headers.length;i++){if(!obj.options.columns[i]){obj.options.columns[i]={type:'text',align:obj.options.defaultColAlign,width:obj.options.defaultColWidth};}
if(typeof obj.options.columns[i].title==='undefined'){obj.options.columns[i].title=headers[i];}}}
obj.options.data=newData;obj.prepareTable();if(obj.options.loadingSpin==true){jSuites.loading.hide();}}});}else if(obj.options.url){if(obj.options.loadingSpin==true){jSuites.loading.show();}
jSuites.ajax({url:obj.options.url,method:obj.options.method,data:obj.options.requestVariables,dataType:'json',success:function(result){obj.options.data=(result.data)?result.data:result;obj.prepareTable();if(obj.options.loadingSpin==true){jSuites.loading.hide();}}});}else{obj.prepareTable();}}
if(options&&options.contextMenu!=null){obj.options.contextMenu=options.contextMenu;}else{obj.options.contextMenu=function(el,x,y,e){var items=[];if(y==null){if(obj.options.allowInsertColumn==true){items.push({title:obj.options.text.insertANewColumnBefore,onclick:function(){obj.insertColumn(1,parseInt(x),1);}});}
if(obj.options.allowInsertColumn==true){items.push({title:obj.options.text.insertANewColumnAfter,onclick:function(){obj.insertColumn(1,parseInt(x),0);}});}
if(obj.options.allowDeleteColumn==true){items.push({title:obj.options.text.deleteSelectedColumns,onclick:function(){obj.deleteColumn(obj.getSelectedColumns().length?undefined:parseInt(x));}});}
if(obj.options.allowRenameColumn==true){items.push({title:obj.options.text.renameThisColumn,onclick:function(){obj.setHeader(x);}});}
if(obj.options.columnSorting==true){items.push({type:'line'});items.push({title:obj.options.text.orderAscending,onclick:function(){obj.orderBy(x,0);}});items.push({title:obj.options.text.orderDescending,onclick:function(){obj.orderBy(x,1);}});}}else{if(obj.options.allowInsertRow==true){items.push({title:obj.options.text.insertANewRowBefore,onclick:function(){obj.insertRow(1,parseInt(y),1);}});items.push({title:obj.options.text.insertANewRowAfter,onclick:function(){obj.insertRow(1,parseInt(y));}});}
if(obj.options.allowDeleteRow==true){items.push({title:obj.options.text.deleteSelectedRows,onclick:function(){obj.deleteRow(obj.getSelectedRows().length?undefined:parseInt(y));}});}
if(x){if(obj.options.allowComments==true){items.push({type:'line'});var title=obj.records[y][x].getAttribute('title')||'';items.push({title:title?obj.options.text.editComments:obj.options.text.addComments,onclick:function(){var comment=prompt(obj.options.text.comments,title);if(comment){obj.setComments([x,y],comment);}}});if(title){items.push({title:obj.options.text.clearComments,onclick:function(){obj.setComments([x,y],'');}});}}}}
items.push({type:'line'});items.push({title:obj.options.text.copy,shortcut:'Ctrl + C',onclick:function(){obj.copy(true);}});if(navigator&&navigator.clipboard){items.push({title:obj.options.text.paste,shortcut:'Ctrl + V',onclick:function(){if(obj.selectedCell){navigator.clipboard.readText().then(function(text){if(text){jexcel.current.paste(obj.selectedCell[0],obj.selectedCell[1],text);}});}}});}
if(obj.options.allowExport){items.push({title:obj.options.text.saveAs,shortcut:'Ctrl + S',onclick:function(){obj.download();}});}
if(obj.options.about){items.push({title:obj.options.text.about,onclick:function(){if(obj.options.about===true){alert(Version().print());}else{alert(obj.options.about);}}});}
return items;}}
obj.scrollControls=function(e){obj.wheelControls();if(obj.options.freezeColumns>0&&obj.content.scrollLeft!=scrollLeft){obj.updateFreezePosition();}
if(obj.options.lazyLoading==true||obj.options.tableOverflow==true){if(obj.edition&&e.target.className.substr(0,9)!='jdropdown'){obj.closeEditor(obj.edition[0],true);}}}
obj.wheelControls=function(e){if(obj.options.lazyLoading==true){if(jexcel.timeControlLoading==null){jexcel.timeControlLoading=setTimeout(function(){if(obj.content.scrollTop+obj.content.clientHeight>=obj.content.scrollHeight-10){if(obj.loadDown()){if(obj.content.scrollTop+obj.content.clientHeight>obj.content.scrollHeight-10){obj.content.scrollTop=obj.content.scrollTop-obj.content.clientHeight;}
obj.updateCornerPosition();}}else if(obj.content.scrollTop<=obj.content.clientHeight){if(obj.loadUp()){if(obj.content.scrollTop<10){obj.content.scrollTop=obj.content.scrollTop+obj.content.clientHeight;}
obj.updateCornerPosition();}}
jexcel.timeControlLoading=null;},100);}}}
obj.getFreezeWidth=function(){var width=0;if(obj.options.freezeColumns>0){for(var i=0;i<obj.options.freezeColumns;i++){width+=parseInt(obj.options.columns[i].width);}}
return width;}
var scrollLeft=0;obj.updateFreezePosition=function(){scrollLeft=obj.content.scrollLeft;var width=0;if(scrollLeft>50){for(var i=0;i<obj.options.freezeColumns;i++){if(i>0){if(obj.options.columns[i-1].type!=="hidden"){width+=parseInt(obj.options.columns[i-1].width);}}
obj.headers[i].classList.add('jexcel_freezed');obj.headers[i].style.left=width+'px';for(var j=0;j<obj.rows.length;j++){if(obj.rows[j]&&obj.records[j][i]){var shifted=(scrollLeft+(i>0?obj.records[j][i-1].style.width:0))-51+'px';obj.records[j][i].classList.add('jexcel_freezed');obj.records[j][i].style.left=shifted;}}}}else{for(var i=0;i<obj.options.freezeColumns;i++){obj.headers[i].classList.remove('jexcel_freezed');obj.headers[i].style.left='';for(var j=0;j<obj.rows.length;j++){if(obj.records[j][i]){obj.records[j][i].classList.remove('jexcel_freezed');obj.records[j][i].style.left='';}}}}
obj.updateCornerPosition();}
el.addEventListener("DOMMouseScroll",obj.wheelControls);el.addEventListener("mousewheel",obj.wheelControls);el.jexcel=obj;el.jspreadsheet=obj;obj.init();return obj;});jexcel.setDictionary=function(o){jSuites.setDictionary(o);}
jexcel.setExtensions=function(o){var k=Object.keys(o);for(var i=0;i<k.length;i++){if(typeof(o[k[i]])==='function'){jexcel[k[i]]=o[k[i]];if(jexcel.license&&typeof(o[k[i]].license)=='function'){o[k[i]].license(jexcel.license);}}}}
if(typeof(formula)!=='undefined'){jexcel.formula=formula;}
jexcel.version=Version;jexcel.current=null;jexcel.timeControl=null;jexcel.timeControlLoading=null;jexcel.destroy=function(element,destroyEventHandlers){if(element.jexcel){var root=element.jexcel.options.root?element.jexcel.options.root:document;element.removeEventListener("DOMMouseScroll",element.jexcel.scrollControls);element.removeEventListener("mousewheel",element.jexcel.scrollControls);element.jexcel=null;element.innerHTML='';if(destroyEventHandlers){root.removeEventListener("mouseup",jexcel.mouseUpControls);root.removeEventListener("mousedown",jexcel.mouseDownControls);root.removeEventListener("mousemove",jexcel.mouseMoveControls);root.removeEventListener("mouseover",jexcel.mouseOverControls);root.removeEventListener("dblclick",jexcel.doubleClickControls);root.removeEventListener("paste",jexcel.pasteControls);root.removeEventListener("contextmenu",jexcel.contextMenuControls);root.removeEventListener("touchstart",jexcel.touchStartControls);root.removeEventListener("touchend",jexcel.touchEndControls);root.removeEventListener("touchcancel",jexcel.touchEndControls);document.removeEventListener("keydown",jexcel.keyDownControls);jexcel=null;}}}
jexcel.build=function(root){root.addEventListener("mouseup",jexcel.mouseUpControls);root.addEventListener("mousedown",jexcel.mouseDownControls);root.addEventListener("mousemove",jexcel.mouseMoveControls);root.addEventListener("mouseover",jexcel.mouseOverControls);root.addEventListener("dblclick",jexcel.doubleClickControls);root.addEventListener("paste",jexcel.pasteControls);root.addEventListener("contextmenu",jexcel.contextMenuControls);root.addEventListener("touchstart",jexcel.touchStartControls);root.addEventListener("touchend",jexcel.touchEndControls);root.addEventListener("touchcancel",jexcel.touchEndControls);root.addEventListener("touchmove",jexcel.touchEndControls);document.addEventListener("keydown",jexcel.keyDownControls);}
jexcel.keyDownControls=function(e){if(jexcel.current){if(jexcel.current.edition){if(e.which==27){if(jexcel.current.edition){jexcel.current.closeEditor(jexcel.current.edition[0],false);}
e.preventDefault();}else if(e.which==13){if(jexcel.current.options.columns[jexcel.current.edition[2]].type=='calendar'){jexcel.current.closeEditor(jexcel.current.edition[0],true);}else if(jexcel.current.options.columns[jexcel.current.edition[2]].type=='dropdown'||jexcel.current.options.columns[jexcel.current.edition[2]].type=='autocomplete'){}else{if((jexcel.current.options.wordWrap==true||jexcel.current.options.columns[jexcel.current.edition[2]].wordWrap==true||jexcel.current.options.data[jexcel.current.edition[3]][jexcel.current.edition[2]].length>200)&&e.altKey){var editorTextarea=jexcel.current.edition[0].children[0];var editorValue=jexcel.current.edition[0].children[0].value;var editorIndexOf=editorTextarea.selectionStart;editorValue=editorValue.slice(0,editorIndexOf)+"\n"+editorValue.slice(editorIndexOf);editorTextarea.value=editorValue;editorTextarea.focus();editorTextarea.selectionStart=editorIndexOf+1;editorTextarea.selectionEnd=editorIndexOf+1;}else{jexcel.current.edition[0].children[0].blur();}}}else if(e.which==9){if(jexcel.current.options.columns[jexcel.current.edition[2]].type=='calendar'){jexcel.current.closeEditor(jexcel.current.edition[0],true);}else{jexcel.current.edition[0].children[0].blur();}}}
if(!jexcel.current.edition&&jexcel.current.selectedCell){if(e.which==37){jexcel.current.left(e.shiftKey,e.ctrlKey);e.preventDefault();}else if(e.which==39){jexcel.current.right(e.shiftKey,e.ctrlKey);e.preventDefault();}else if(e.which==38){jexcel.current.up(e.shiftKey,e.ctrlKey);e.preventDefault();}else if(e.which==40){jexcel.current.down(e.shiftKey,e.ctrlKey);e.preventDefault();}else if(e.which==36){jexcel.current.first(e.shiftKey,e.ctrlKey);e.preventDefault();}else if(e.which==35){jexcel.current.last(e.shiftKey,e.ctrlKey);e.preventDefault();}else if(e.which==32){if(jexcel.current.options.editable==true){jexcel.current.setCheckRadioValue();}
e.preventDefault();}else if(e.which==46){if(jexcel.current.options.editable==true){if(jexcel.current.selectedRow){if(jexcel.current.options.allowDeleteRow==true){if(confirm(jexcel.current.options.text.areYouSureToDeleteTheSelectedRows)){jexcel.current.deleteRow();}}}else if(jexcel.current.selectedHeader){if(jexcel.current.options.allowDeleteColumn==true){if(confirm(jexcel.current.options.text.areYouSureToDeleteTheSelectedColumns)){jexcel.current.deleteColumn();}}}else{jexcel.current.setValue(jexcel.current.highlighted,'');}}}else if(e.which==13){if(e.shiftKey){jexcel.current.up();}else{if(jexcel.current.options.allowInsertRow==true){if(jexcel.current.options.allowManualInsertRow==true){if(jexcel.current.selectedCell[1]==jexcel.current.options.data.length-1){jexcel.current.insertRow();}}}
jexcel.current.down();}
e.preventDefault();}else if(e.which==9){if(e.shiftKey){jexcel.current.left();}else{if(jexcel.current.options.allowInsertColumn==true){if(jexcel.current.options.allowManualInsertColumn==true){if(jexcel.current.selectedCell[0]==jexcel.current.options.data[0].length-1){jexcel.current.insertColumn();}}}
jexcel.current.right();}
e.preventDefault();}else{if((e.ctrlKey||e.metaKey)&&!e.shiftKey){if(e.which==65){jexcel.current.selectAll();e.preventDefault();}else if(e.which==83){jexcel.current.download();e.preventDefault();}else if(e.which==89){jexcel.current.redo();e.preventDefault();}else if(e.which==90){jexcel.current.undo();e.preventDefault();}else if(e.which==67){jexcel.current.copy(true);e.preventDefault();}else if(e.which==88){if(jexcel.current.options.editable==true){jexcel.cutControls();}else{jexcel.copyControls();}
e.preventDefault();}else if(e.which==86){jexcel.pasteControls();}}else{if(jexcel.current.selectedCell){if(jexcel.current.options.editable==true){var rowId=jexcel.current.selectedCell[1];var columnId=jexcel.current.selectedCell[0];if(jexcel.current.options.columns[columnId].type!='readonly'){if(e.keyCode==32){if(jexcel.current.options.columns[columnId].type=='checkbox'||jexcel.current.options.columns[columnId].type=='radio'){e.preventDefault();}else{jexcel.current.openEditor(jexcel.current.records[rowId][columnId],true);}}else if(e.keyCode==113){jexcel.current.openEditor(jexcel.current.records[rowId][columnId],false);}else if((e.keyCode==8)||(e.keyCode>=48&&e.keyCode<=57)||(e.keyCode>=96&&e.keyCode<=111)||(e.keyCode>=187&&e.keyCode<=190)||((String.fromCharCode(e.keyCode)==e.key||String.fromCharCode(e.keyCode).toLowerCase()==e.key.toLowerCase())&&jexcel.validLetter(String.fromCharCode(e.keyCode)))){jexcel.current.openEditor(jexcel.current.records[rowId][columnId],true);if(jexcel.current.options.columns[columnId].type=='calendar'){e.preventDefault();}}}}}}}}else{if(e.target.classList.contains('jexcel_search')){if(jexcel.timeControl){clearTimeout(jexcel.timeControl);}
jexcel.timeControl=setTimeout(function(){jexcel.current.search(e.target.value);},200);}}}}
jexcel.isMouseAction=false;jexcel.mouseDownControls=function(e){e=e||window.event;if(e.buttons){var mouseButton=e.buttons;}else if(e.button){var mouseButton=e.button;}else{var mouseButton=e.which;}
var jexcelTable=jexcel.getElement(e.target);if(jexcelTable[0]){if(jexcel.current!=jexcelTable[0].jexcel){if(jexcel.current){if(jexcel.current.edition){jexcel.current.closeEditor(jexcel.current.edition[0],true);}
jexcel.current.resetSelection();}
jexcel.current=jexcelTable[0].jexcel;}}else{if(jexcel.current){if(jexcel.current.edition){jexcel.current.closeEditor(jexcel.current.edition[0],true);}
jexcel.current.resetSelection(true);jexcel.current=null;}}
if(jexcel.current&&mouseButton==1){if(e.target.classList.contains('jexcel_selectall')){if(jexcel.current){jexcel.current.selectAll();}}else if(e.target.classList.contains('jexcel_corner')){if(jexcel.current.options.editable==true){jexcel.current.selectedCorner=true;}}else{if(jexcelTable[1]==1){var columnId=e.target.getAttribute('data-x');if(columnId){var info=e.target.getBoundingClientRect();if(jexcel.current.options.columnResize==true&&info.width-e.offsetX<6){jexcel.current.resizing={mousePosition:e.pageX,column:columnId,width:info.width,};jexcel.current.headers[columnId].classList.add('resizing');for(var j=0;j<jexcel.current.records.length;j++){if(jexcel.current.records[j][columnId]){jexcel.current.records[j][columnId].classList.add('resizing');}}}else if(jexcel.current.options.columnDrag==true&&info.height-e.offsetY<6){if(jexcel.current.isColMerged(columnId).length){console.error('Jspreadsheet: This column is part of a merged cell.');}else{jexcel.current.resetSelection();jexcel.current.dragging={element:e.target,column:columnId,destination:columnId,};jexcel.current.headers[columnId].classList.add('dragging');for(var j=0;j<jexcel.current.records.length;j++){if(jexcel.current.records[j][columnId]){jexcel.current.records[j][columnId].classList.add('dragging');}}}}else{if(jexcel.current.selectedHeader&&(e.shiftKey||e.ctrlKey)){var o=jexcel.current.selectedHeader;var d=columnId;}else{if(jexcel.current.selectedHeader==columnId&&jexcel.current.options.allowRenameColumn==true){jexcel.timeControl=setTimeout(function(){jexcel.current.setHeader(columnId);},800);}
jexcel.current.selectedHeader=columnId;var o=columnId;var d=columnId;}
jexcel.current.updateSelectionFromCoords(o,0,d,jexcel.current.options.data.length-1);}}else{if(e.target.parentNode.classList.contains('jexcel_nested')){if(e.target.getAttribute('data-column')){var column=e.target.getAttribute('data-column').split(',');var c1=parseInt(column[0]);var c2=parseInt(column[column.length-1]);}else{var c1=0;var c2=jexcel.current.options.columns.length-1;}
jexcel.current.updateSelectionFromCoords(c1,0,c2,jexcel.current.options.data.length-1);}}}else{jexcel.current.selectedHeader=false;}
if(jexcelTable[1]==2){var rowId=e.target.getAttribute('data-y');if(e.target.classList.contains('jexcel_row')){var info=e.target.getBoundingClientRect();if(jexcel.current.options.rowResize==true&&info.height-e.offsetY<6){jexcel.current.resizing={element:e.target.parentNode,mousePosition:e.pageY,row:rowId,height:info.height,};e.target.parentNode.classList.add('resizing');}else if(jexcel.current.options.rowDrag==true&&info.width-e.offsetX<6){if(jexcel.current.isRowMerged(rowId).length){console.error('Jspreadsheet: This row is part of a merged cell');}else if(jexcel.current.options.search==true&&jexcel.current.results){console.error('Jspreadsheet: Please clear your search before perform this action');}else{jexcel.current.resetSelection();jexcel.current.dragging={element:e.target.parentNode,row:rowId,destination:rowId,};e.target.parentNode.classList.add('dragging');}}else{if(jexcel.current.selectedRow&&(e.shiftKey||e.ctrlKey)){var o=jexcel.current.selectedRow;var d=rowId;}else{jexcel.current.selectedRow=rowId;var o=rowId;var d=rowId;}
jexcel.current.updateSelectionFromCoords(0,o,jexcel.current.options.data[0].length-1,d);}}else{if(e.target.classList.contains('jclose')&&e.target.clientWidth-e.offsetX<50&&e.offsetY<50){jexcel.current.closeEditor(jexcel.current.edition[0],true);}else{var getCellCoords=function(element){var x=element.getAttribute('data-x');var y=element.getAttribute('data-y');if(x&&y){return[x,y];}else{if(element.parentNode){return getCellCoords(element.parentNode);}}};var position=getCellCoords(e.target);if(position){var columnId=position[0];var rowId=position[1];if(jexcel.current.edition){if(jexcel.current.edition[2]!=columnId||jexcel.current.edition[3]!=rowId){jexcel.current.closeEditor(jexcel.current.edition[0],true);}}
if(!jexcel.current.edition){if(e.shiftKey){jexcel.current.updateSelectionFromCoords(jexcel.current.selectedCell[0],jexcel.current.selectedCell[1],columnId,rowId);}else{jexcel.current.updateSelectionFromCoords(columnId,rowId);}}
jexcel.current.selectedHeader=null;jexcel.current.selectedRow=null;}}}}else{jexcel.current.selectedRow=false;}
if(e.target.classList.contains('jexcel_page')){if(e.target.innerText=='<'){jexcel.current.page(0);}else if(e.target.innerText=='>'){jexcel.current.page(e.target.getAttribute('title')-1);}else{jexcel.current.page(e.target.innerText-1);}}}
if(jexcel.current.edition){jexcel.isMouseAction=false;}else{jexcel.isMouseAction=true;}}else{jexcel.isMouseAction=false;}}
jexcel.mouseUpControls=function(e){if(jexcel.current){if(jexcel.current.resizing){if(jexcel.current.resizing.column){var newWidth=jexcel.current.colgroup[jexcel.current.resizing.column].getAttribute('width');var columns=jexcel.current.getSelectedColumns();if(columns.length>1){var currentWidth=[];for(var i=0;i<columns.length;i++){currentWidth.push(parseInt(jexcel.current.colgroup[columns[i]].getAttribute('width')));}
var index=columns.indexOf(parseInt(jexcel.current.resizing.column));currentWidth[index]=jexcel.current.resizing.width;jexcel.current.setWidth(columns,newWidth,currentWidth);}else{jexcel.current.setWidth(jexcel.current.resizing.column,newWidth,jexcel.current.resizing.width);}
jexcel.current.headers[jexcel.current.resizing.column].classList.remove('resizing');for(var j=0;j<jexcel.current.records.length;j++){if(jexcel.current.records[j][jexcel.current.resizing.column]){jexcel.current.records[j][jexcel.current.resizing.column].classList.remove('resizing');}}}else{jexcel.current.rows[jexcel.current.resizing.row].children[0].classList.remove('resizing');var newHeight=jexcel.current.rows[jexcel.current.resizing.row].getAttribute('height');jexcel.current.setHeight(jexcel.current.resizing.row,newHeight,jexcel.current.resizing.height);jexcel.current.resizing.element.classList.remove('resizing');}
jexcel.current.resizing=null;}else if(jexcel.current.dragging){if(jexcel.current.dragging){if(jexcel.current.dragging.column){var columnId=e.target.getAttribute('data-x');jexcel.current.headers[jexcel.current.dragging.column].classList.remove('dragging');for(var j=0;j<jexcel.current.rows.length;j++){if(jexcel.current.records[j][jexcel.current.dragging.column]){jexcel.current.records[j][jexcel.current.dragging.column].classList.remove('dragging');}}
for(var i=0;i<jexcel.current.headers.length;i++){jexcel.current.headers[i].classList.remove('dragging-left');jexcel.current.headers[i].classList.remove('dragging-right');}
if(columnId){if(jexcel.current.dragging.column!=jexcel.current.dragging.destination){jexcel.current.moveColumn(jexcel.current.dragging.column,jexcel.current.dragging.destination);}}}else{if(jexcel.current.dragging.element.nextSibling){var position=parseInt(jexcel.current.dragging.element.nextSibling.getAttribute('data-y'));if(jexcel.current.dragging.row<position){position-=1;}}else{var position=parseInt(jexcel.current.dragging.element.previousSibling.getAttribute('data-y'));}
if(jexcel.current.dragging.row!=jexcel.current.dragging.destination){jexcel.current.moveRow(jexcel.current.dragging.row,position,true);}
jexcel.current.dragging.element.classList.remove('dragging');}
jexcel.current.dragging=null;}}else{if(jexcel.current.selectedCorner){jexcel.current.selectedCorner=false;if(jexcel.current.selection.length>0){jexcel.current.copyData(jexcel.current.selection[0],jexcel.current.selection[jexcel.current.selection.length-1]);jexcel.current.removeCopySelection();}}}}
if(jexcel.timeControl){clearTimeout(jexcel.timeControl);jexcel.timeControl=null;}
jexcel.isMouseAction=false;}
jexcel.mouseMoveControls=function(e){e=e||window.event;if(e.buttons){var mouseButton=e.buttons;}else if(e.button){var mouseButton=e.button;}else{var mouseButton=e.which;}
if(!mouseButton){jexcel.isMouseAction=false;}
if(jexcel.current){if(jexcel.isMouseAction==true){if(jexcel.current.resizing){if(jexcel.current.resizing.column){var width=e.pageX-jexcel.current.resizing.mousePosition;if(jexcel.current.resizing.width+width>0){var tempWidth=jexcel.current.resizing.width+width;jexcel.current.colgroup[jexcel.current.resizing.column].setAttribute('width',tempWidth);jexcel.current.updateCornerPosition();}}else{var height=e.pageY-jexcel.current.resizing.mousePosition;if(jexcel.current.resizing.height+height>0){var tempHeight=jexcel.current.resizing.height+height;jexcel.current.rows[jexcel.current.resizing.row].setAttribute('height',tempHeight);jexcel.current.updateCornerPosition();}}}else if(jexcel.current.dragging){if(jexcel.current.dragging.column){var columnId=e.target.getAttribute('data-x');if(columnId){if(jexcel.current.isColMerged(columnId).length){console.error('Jspreadsheet: This column is part of a merged cell.');}else{for(var i=0;i<jexcel.current.headers.length;i++){jexcel.current.headers[i].classList.remove('dragging-left');jexcel.current.headers[i].classList.remove('dragging-right');}
if(jexcel.current.dragging.column==columnId){jexcel.current.dragging.destination=parseInt(columnId);}else{if(e.target.clientWidth/2>e.offsetX){if(jexcel.current.dragging.column<columnId){jexcel.current.dragging.destination=parseInt(columnId)-1;}else{jexcel.current.dragging.destination=parseInt(columnId);}
jexcel.current.headers[columnId].classList.add('dragging-left');}else{if(jexcel.current.dragging.column<columnId){jexcel.current.dragging.destination=parseInt(columnId);}else{jexcel.current.dragging.destination=parseInt(columnId)+1;}
jexcel.current.headers[columnId].classList.add('dragging-right');}}}}}else{var rowId=e.target.getAttribute('data-y');if(rowId){if(jexcel.current.isRowMerged(rowId).length){console.error('Jspreadsheet: This row is part of a merged cell.');}else{var target=(e.target.clientHeight/2>e.offsetY)?e.target.parentNode.nextSibling:e.target.parentNode;if(jexcel.current.dragging.element!=target){e.target.parentNode.parentNode.insertBefore(jexcel.current.dragging.element,target);jexcel.current.dragging.destination=Array.prototype.indexOf.call(jexcel.current.dragging.element.parentNode.children,jexcel.current.dragging.element);}}}}}}else{var x=e.target.getAttribute('data-x');var y=e.target.getAttribute('data-y');var rect=e.target.getBoundingClientRect();if(jexcel.current.cursor){jexcel.current.cursor.style.cursor='';jexcel.current.cursor=null;}
if(e.target.parentNode.parentNode&&e.target.parentNode.parentNode.className){if(e.target.parentNode.parentNode.classList.contains('resizable')){if(e.target&&x&&!y&&(rect.width-(e.clientX-rect.left)<6)){jexcel.current.cursor=e.target;jexcel.current.cursor.style.cursor='col-resize';}else if(e.target&&!x&&y&&(rect.height-(e.clientY-rect.top)<6)){jexcel.current.cursor=e.target;jexcel.current.cursor.style.cursor='row-resize';}}
if(e.target.parentNode.parentNode.classList.contains('draggable')){if(e.target&&!x&&y&&(rect.width-(e.clientX-rect.left)<6)){jexcel.current.cursor=e.target;jexcel.current.cursor.style.cursor='move';}else if(e.target&&x&&!y&&(rect.height-(e.clientY-rect.top)<6)){jexcel.current.cursor=e.target;jexcel.current.cursor.style.cursor='move';}}}}}}
jexcel.mouseOverControls=function(e){e=e||window.event;if(e.buttons){var mouseButton=e.buttons;}else if(e.button){var mouseButton=e.button;}else{var mouseButton=e.which;}
if(!mouseButton){jexcel.isMouseAction=false;}
if(jexcel.current&&jexcel.isMouseAction==true){var jexcelTable=jexcel.getElement(e.target);if(jexcelTable[0]){if(jexcel.current!=jexcelTable[0].jexcel){if(jexcel.current){return false;}}
var columnId=e.target.getAttribute('data-x');var rowId=e.target.getAttribute('data-y');if(jexcel.current.resizing||jexcel.current.dragging){}else{if(jexcelTable[1]==1){if(jexcel.current.selectedHeader){var columnId=e.target.getAttribute('data-x');var o=jexcel.current.selectedHeader;var d=columnId;jexcel.current.updateSelectionFromCoords(o,0,d,jexcel.current.options.data.length-1);}}
if(jexcelTable[1]==2){if(e.target.classList.contains('jexcel_row')){if(jexcel.current.selectedRow){var o=jexcel.current.selectedRow;var d=rowId;jexcel.current.updateSelectionFromCoords(0,o,jexcel.current.options.data[0].length-1,d);}}else{if(!jexcel.current.edition){if(columnId&&rowId){if(jexcel.current.selectedCorner){jexcel.current.updateCopySelection(columnId,rowId);}else{if(jexcel.current.selectedCell){jexcel.current.updateSelectionFromCoords(jexcel.current.selectedCell[0],jexcel.current.selectedCell[1],columnId,rowId);}}}}}}}}}
if(jexcel.timeControl){clearTimeout(jexcel.timeControl);jexcel.timeControl=null;}}
jexcel.doubleClickControls=function(e){if(jexcel.current){if(e.target.classList.contains('jexcel_corner')){if(jexcel.current.highlighted.length>0){var x1=jexcel.current.highlighted[0].getAttribute('data-x');var y1=parseInt(jexcel.current.highlighted[jexcel.current.highlighted.length-1].getAttribute('data-y'))+1;var x2=jexcel.current.highlighted[jexcel.current.highlighted.length-1].getAttribute('data-x');var y2=jexcel.current.records.length-1
jexcel.current.copyData(jexcel.current.records[y1][x1],jexcel.current.records[y2][x2]);}}else if(e.target.classList.contains('jexcel_column_filter')){var columnId=e.target.getAttribute('data-x');jexcel.current.openFilter(columnId);}else{var jexcelTable=jexcel.getElement(e.target);if(jexcelTable[1]==1&&jexcel.current.options.columnSorting==true){var columnId=e.target.getAttribute('data-x');if(columnId){jexcel.current.orderBy(columnId);}}
if(jexcelTable[1]==2&&jexcel.current.options.editable==true){if(!jexcel.current.edition){var getCellCoords=function(element){if(element.parentNode){var x=element.getAttribute('data-x');var y=element.getAttribute('data-y');if(x&&y){return element;}else{return getCellCoords(element.parentNode);}}}
var cell=getCellCoords(e.target);if(cell&&cell.classList.contains('highlight')){jexcel.current.openEditor(cell);}}}}}}
jexcel.copyControls=function(e){if(jexcel.current&&jexcel.copyControls.enabled){if(!jexcel.current.edition){jexcel.current.copy(true);}}}
jexcel.cutControls=function(e){if(jexcel.current){if(!jexcel.current.edition){jexcel.current.copy(true);if(jexcel.current.options.editable==true){jexcel.current.setValue(jexcel.current.highlighted,'');}}}}
jexcel.pasteControls=function(e){if(jexcel.current&&jexcel.current.selectedCell){if(!jexcel.current.edition){if(jexcel.current.options.editable==true){if(e&&e.clipboardData){jexcel.current.paste(jexcel.current.selectedCell[0],jexcel.current.selectedCell[1],e.clipboardData.getData('text'));e.preventDefault();}else if(window.clipboardData){jexcel.current.paste(jexcel.current.selectedCell[0],jexcel.current.selectedCell[1],window.clipboardData.getData('text'));}}}}}
jexcel.contextMenuControls=function(e){e=e||window.event;if("buttons"in e){var mouseButton=e.buttons;}else{var mouseButton=e.which||e.button;}
if(jexcel.current){if(jexcel.current.edition){e.preventDefault();}else if(jexcel.current.options.contextMenu){jexcel.current.contextMenu.contextmenu.close();if(jexcel.current){var x=e.target.getAttribute('data-x');var y=e.target.getAttribute('data-y');if(x||y){if((x<parseInt(jexcel.current.selectedCell[0]))||(x>parseInt(jexcel.current.selectedCell[2]))||(y<parseInt(jexcel.current.selectedCell[1]))||(y>parseInt(jexcel.current.selectedCell[3])))
{jexcel.current.updateSelectionFromCoords(x,y,x,y);}
var items=jexcel.current.options.contextMenu(jexcel.current,x,y,e);jexcel.current.contextMenu.contextmenu.open(e,items);e.preventDefault();}}}}}
jexcel.touchStartControls=function(e){var jexcelTable=jexcel.getElement(e.target);if(jexcelTable[0]){if(jexcel.current!=jexcelTable[0].jexcel){if(jexcel.current){jexcel.current.resetSelection();}
jexcel.current=jexcelTable[0].jexcel;}}else{if(jexcel.current){jexcel.current.resetSelection();jexcel.current=null;}}
if(jexcel.current){if(!jexcel.current.edition){var columnId=e.target.getAttribute('data-x');var rowId=e.target.getAttribute('data-y');if(columnId&&rowId){jexcel.current.updateSelectionFromCoords(columnId,rowId);jexcel.timeControl=setTimeout(function(){if(jexcel.current.options.columns[columnId].type=='color'){jexcel.tmpElement=null;}else{jexcel.tmpElement=e.target;}
jexcel.current.openEditor(e.target,false,e);},500);}}}}
jexcel.touchEndControls=function(e){if(jexcel.timeControl){clearTimeout(jexcel.timeControl);jexcel.timeControl=null;if(jexcel.tmpElement&&jexcel.tmpElement.children[0].tagName=='INPUT'){jexcel.tmpElement.children[0].focus();}
jexcel.tmpElement=null;}}
jexcel.tabs=function(tabs,result){var instances=[];if(!tabs.classList.contains('jexcel_tabs')){tabs.innerHTML='';tabs.classList.add('jexcel_tabs')
tabs.jexcel=[];var div=document.createElement('div');var headers=tabs.appendChild(div);var div=document.createElement('div');var content=tabs.appendChild(div);}else{var headers=tabs.children[0];var content=tabs.children[1];}
var spreadsheet=[]
var link=[];for(var i=0;i<result.length;i++){spreadsheet[i]=document.createElement('div');spreadsheet[i].classList.add('jexcel_tab');var worksheet=jexcel(spreadsheet[i],result[i]);content.appendChild(spreadsheet[i]);instances[i]=tabs.jexcel.push(worksheet);link[i]=document.createElement('div');link[i].classList.add('jexcel_tab_link');link[i].setAttribute('data-spreadsheet',tabs.jexcel.length-1);link[i].innerHTML=result[i].sheetName;link[i].onclick=function(){for(var j=0;j<headers.children.length;j++){headers.children[j].classList.remove('selected');content.children[j].style.display='none';}
var i=this.getAttribute('data-spreadsheet');content.children[i].style.display='block';headers.children[i].classList.add('selected')}
headers.appendChild(link[i]);}
for(var j=0;j<headers.children.length;j++){headers.children[j].classList.remove('selected');content.children[j].style.display='none';}
headers.children[headers.children.length-1].classList.add('selected');content.children[headers.children.length-1].style.display='block';return instances;}
jexcel.createTabs=jexcel.tabs;jexcel.fromSpreadsheet=function(file,__callback){var convert=function(workbook){var spreadsheets=[];workbook.SheetNames.forEach(function(sheetName){var spreadsheet={};spreadsheet.rows=[];spreadsheet.columns=[];spreadsheet.data=[];spreadsheet.style={};spreadsheet.sheetName=sheetName;var temp=workbook.Sheets[sheetName]['!cols'];if(temp&&temp.length){for(var i=0;i<temp.length;i++){spreadsheet.columns[i]={};if(temp[i]&&temp[i].wpx){spreadsheet.columns[i].width=temp[i].wpx+'px';}}}
var temp=workbook.Sheets[sheetName]['!rows'];if(temp&&temp.length){for(var i=0;i<temp.length;i++){if(temp[i]&&temp[i].hpx){spreadsheet.rows[i]={};spreadsheet.rows[i].height=temp[i].hpx+'px';}}}
var temp=workbook.Sheets[sheetName]['!merges'];if(temp&&temp.length>0){spreadsheet.mergeCells=[];for(var i=0;i<temp.length;i++){var x1=temp[i].s.c;var y1=temp[i].s.r;var x2=temp[i].e.c;var y2=temp[i].e.r;var key=jexcel.getColumnNameFromId([x1,y1]);spreadsheet.mergeCells[key]=[x2-x1+1,y2-y1+1];}}
var max_x=0;var max_y=0;var temp=Object.keys(workbook.Sheets[sheetName]);for(var i=0;i<temp.length;i++){if(temp[i].substr(0,1)!='!'){var cell=workbook.Sheets[sheetName][temp[i]];var info=jexcel.getIdFromColumnName(temp[i],true);if(!spreadsheet.data[info[1]]){spreadsheet.data[info[1]]=[];}
spreadsheet.data[info[1]][info[0]]=cell.f?'='+cell.f:cell.w;if(max_x<info[0]){max_x=info[0];}
if(max_y<info[1]){max_y=info[1];}
if(cell.style&&Object.keys(cell.style).length>0){spreadsheet.style[temp[i]]=cell.style;}
if(cell.s&&cell.s.fgColor){if(spreadsheet.style[temp[i]]){spreadsheet.style[temp[i]]+=';';}
spreadsheet.style[temp[i]]+='background-color:#'+cell.s.fgColor.rgb;}}}
var numColumns=spreadsheet.columns;for(var j=0;j<=max_y;j++){for(var i=0;i<=max_x;i++){if(!spreadsheet.data[j]){spreadsheet.data[j]=[];}
if(!spreadsheet.data[j][i]){if(numColumns<i){spreadsheet.data[j][i]='';}}}}
spreadsheets.push(spreadsheet);});return spreadsheets;}
var oReq;oReq=new XMLHttpRequest();oReq.open("GET",file,true);if(typeof Uint8Array!=='undefined'){oReq.responseType="arraybuffer";oReq.onload=function(e){var arraybuffer=oReq.response;var data=new Uint8Array(arraybuffer);var wb=XLSX.read(data,{type:"array",cellFormula:true,cellStyles:true});__callback(convert(wb))};}else{oReq.setRequestHeader("Accept-Charset","x-user-defined");oReq.onreadystatechange=function(){if(oReq.readyState==4&&oReq.status==200){var ff=convertResponseBodyToText(oReq.responseBody);var wb=XLSX.read(ff,{type:"binary",cellFormula:true,cellStyles:true});__callback(convert(wb))}};}
oReq.send();}
jexcel.validLetter=function(text){var regex=/([\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC-\u0400-\u04FF']+)/g;return text.match(regex)?1:0;}
jexcel.injectArray=function(o,idx,arr){return o.slice(0,idx).concat(arr).concat(o.slice(idx));}
jexcel.getColumnName=function(i){var letter='';if(i>701){letter+=String.fromCharCode(64+parseInt(i/676));letter+=String.fromCharCode(64+parseInt((i%676)/26));}else if(i>25){letter+=String.fromCharCode(64+parseInt(i/26));}
letter+=String.fromCharCode(65+(i%26));return letter;}
jexcel.getIdFromColumnName=function(id,arr){var t=/^[a-zA-Z]+/.exec(id);if(t){var code=0;for(var i=0;i<t[0].length;i++){code+=parseInt(t[0].charCodeAt(i)-64)*Math.pow(26,(t[0].length-1-i));}
code--;if(code<0){code=0;}
var number=parseInt(/[0-9]+$/.exec(id));if(number>0){number--;}
if(arr==true){id=[code,number];}else{id=code+'-'+number;}}
return id;}
jexcel.getColumnNameFromId=function(cellId){if(!Array.isArray(cellId)){cellId=cellId.split('-');}
return jexcel.getColumnName(parseInt(cellId[0]))+(parseInt(cellId[1])+1);}
jexcel.getElement=function(element){var jexcelSection=0;var jexcelElement=0;function path(element){if(element.className){if(element.classList.contains('jexcel_container')){jexcelElement=element;}}
if(element.tagName=='THEAD'){jexcelSection=1;}else if(element.tagName=='TBODY'){jexcelSection=2;}
if(element.parentNode){if(!jexcelElement){path(element.parentNode);}}}
path(element);return[jexcelElement,jexcelSection];}
jexcel.doubleDigitFormat=function(v){v=''+v;if(v.length==1){v='0'+v;}
return v;}
jexcel.createFromTable=function(el,options){if(el.tagName!='TABLE'){console.log('Element is not a table');}else{if(!options){options={};}
options.columns=[];options.data=[];var colgroup=el.querySelectorAll('colgroup > col');if(colgroup.length){for(var i=0;i<colgroup.length;i++){var width=colgroup[i].style.width;if(!width){var width=colgroup[i].getAttribute('width');}
if(width){if(!options.columns[i]){options.columns[i]={}}
options.columns[i].width=width;}}}
var parseHeader=function(header){var info=header.getBoundingClientRect();var width=info.width>50?info.width:50;if(!options.columns[i]){options.columns[i]={};}
if(header.getAttribute('data-celltype')){options.columns[i].type=header.getAttribute('data-celltype');}else{options.columns[i].type='text';}
options.columns[i].width=width+'px';options.columns[i].title=header.innerHTML;options.columns[i].align=header.style.textAlign||'center';if(info=header.getAttribute('name')){options.columns[i].name=info;}
if(info=header.getAttribute('id')){options.columns[i].id=info;}}
var nested=[];var headers=el.querySelectorAll(':scope > thead > tr');if(headers.length){for(var j=0;j<headers.length-1;j++){var cells=[];for(var i=0;i<headers[j].children.length;i++){var row={title:headers[j].children[i].innerText,colspan:headers[j].children[i].getAttribute('colspan')||1,};cells.push(row);}
nested.push(cells);}
headers=headers[headers.length-1].children;for(var i=0;i<headers.length;i++){parseHeader(headers[i]);}}
var rowNumber=0;var mergeCells={};var rows={};var style={};var classes={};var content=el.querySelectorAll(':scope > tr, :scope > tbody > tr');for(var j=0;j<content.length;j++){options.data[rowNumber]=[];if(options.parseTableFirstRowAsHeader==true&&!headers.length&&j==0){for(var i=0;i<content[j].children.length;i++){parseHeader(content[j].children[i]);}}else{for(var i=0;i<content[j].children.length;i++){var value=content[j].children[i].getAttribute('data-formula');if(value){if(value.substr(0,1)!='='){value='='+value;}}else{var value=content[j].children[i].innerHTML;}
options.data[rowNumber].push(value);var cellName=jexcel.getColumnNameFromId([i,j]);var tmp=content[j].children[i].getAttribute('class');if(tmp){classes[cellName]=tmp;}
var mergedColspan=parseInt(content[j].children[i].getAttribute('colspan'))||0;var mergedRowspan=parseInt(content[j].children[i].getAttribute('rowspan'))||0;if(mergedColspan||mergedRowspan){mergeCells[cellName]=[mergedColspan||1,mergedRowspan||1];}
if(s=content[j].children[i].style&&content[j].children[i].style.display=='none'){content[j].children[i].style.display='';}
var s=content[j].children[i].getAttribute('style');if(s){style[cellName]=s;}
if(content[j].children[i].classList.contains('styleBold')){if(style[cellName]){style[cellName]+='; font-weight:bold;';}else{style[cellName]='font-weight:bold;';}}}
if(content[j].style&&content[j].style.height){rows[j]={height:content[j].style.height};}
rowNumber++;}}
if(Object.keys(nested).length>0){options.nestedHeaders=nested;}
if(Object.keys(style).length>0){options.style=style;}
if(Object.keys(mergeCells).length>0){options.mergeCells=mergeCells;}
if(Object.keys(rows).length>0){options.rows=rows;}
if(Object.keys(classes).length>0){options.classes=classes;}
var content=el.querySelectorAll('tfoot tr');if(content.length){var footers=[];for(var j=0;j<content.length;j++){var footer=[];for(var i=0;i<content[j].children.length;i++){footer.push(content[j].children[i].innerText);}
footers.push(footer);}
if(Object.keys(footers).length>0){options.footers=footers;}}
if(options.parseTableAutoCellType==true){var pattern=[];for(var i=0;i<options.columns.length;i++){var test=true;var testCalendar=true;pattern[i]=[];for(var j=0;j<options.data.length;j++){var value=options.data[j][i];if(!pattern[i][value]){pattern[i][value]=0;}
pattern[i][value]++;if(value.length>25){test=false;}
if(value.length==10){if(!(value.substr(4,1)=='-'&&value.substr(7,1)=='-')){testCalendar=false;}}else{testCalendar=false;}}
var keys=Object.keys(pattern[i]).length;if(testCalendar){options.columns[i].type='calendar';}else if(test==true&&keys>1&&keys<=parseInt(options.data.length*0.1)){options.columns[i].type='dropdown';options.columns[i].source=Object.keys(pattern[i]);}}}
return options;}}
jexcel.helpers=(function(){var component={};component.getCaretIndex=function(e){if(this.config.root){var d=this.config.root;}else{var d=window;}
var pos=0;var s=d.getSelection();if(s){if(s.rangeCount!==0){var r=s.getRangeAt(0);var p=r.cloneRange();p.selectNodeContents(e);p.setEnd(r.endContainer,r.endOffset);pos=p.toString().length;}}
return pos;}
component.invert=function(o){var d=[];var k=Object.keys(o);for(var i=0;i<k.length;i++){d[o[k[i]]]=k[i];}
return d;}
component.getColumnName=function(i){var letter='';if(i>701){letter+=String.fromCharCode(64+parseInt(i/676));letter+=String.fromCharCode(64+parseInt((i%676)/26));}else if(i>25){letter+=String.fromCharCode(64+parseInt(i/26));}
letter+=String.fromCharCode(65+(i%26));return letter;}
component.getColumnNameFromCoords=function(x,y){return component.getColumnName(parseInt(x))+(parseInt(y)+1);}
component.getCoordsFromColumnName=function(columnName){var t=/^[a-zA-Z]+/.exec(columnName);if(t){var code=0;for(var i=0;i<t[0].length;i++){code+=parseInt(t[0].charCodeAt(i)-64)*Math.pow(26,(t[0].length-1-i));}
code--;if(code<0){code=0;}
var number=parseInt(/[0-9]+$/.exec(columnName))||null;if(number>0){number--;}
return[code,number];}}
component.createFromTable=function(){}
component.injectArray=function(o,idx,arr){return o.slice(0,idx).concat(arr).concat(o.slice(idx));}
component.parseCSV=function(str,delimiter){delimiter=(delimiter||",");var col=0;var row=0;var num=0;var data=[[]];var limit=0;var flag=null;var inside=false;var closed=false;for(var i=0;i<str.length;i++){if(!data[row]){data[row]=[];}
if(!data[row][col]){data[row][col]='';}
if(str[i]=='\r'){continue;}
if((str[i]=='\n'||str[i]==delimiter)&&(inside==false||closed==true||!flag)){flag=null;inside=false;closed=false;if(data[row][col][0]=='"'){var val=data[row][col].trim();if(val[val.length-1]=='"'){data[row][col]=val.substr(1,val.length-2);}}
if(str[i]=='\n'){col=0;row++;}else{col++;if(col>limit){limit=col;}}}else{if(str[i]=='"'){inside=!inside;}
if(flag===null){flag=inside;if(flag==true){continue;}}else if(flag===true&&!closed){if(str[i]=='"'){if(str[i+1]=='"'){inside=true;data[row][col]+=str[i];i++;}else{closed=true;}
continue;}}
data[row][col]+=str[i];}}
for(var j=0;j<data.length;j++){for(var i=0;i<=limit;i++){if(data[j][i]===undefined){data[j][i]='';}}}
return data;}
return component;})();if(typeof(jQuery)!='undefined'){(function($){$.fn.jspreadsheet=$.fn.jexcel=function(mixed){var spreadsheetContainer=$(this).get(0);if(!spreadsheetContainer.jexcel){return jexcel($(this).get(0),arguments[0]);}else{if(Array.isArray(spreadsheetContainer.jexcel)){return spreadsheetContainer.jexcel[mixed][arguments[1]].apply(this,Array.prototype.slice.call(arguments,2));}else{return spreadsheetContainer.jexcel[mixed].apply(this,Array.prototype.slice.call(arguments,1));}}};})(jQuery);}
return jexcel;})));;(function(global,factory){typeof exports==='object'&&typeof module!=='undefined'?module.exports=factory():typeof define==='function'&&define.amd?define(factory):global.jSuites=factory();}(this,(function(){'use strict';var jSuites=function(options){var obj={}
var version='4.11.5';var find=function(DOMElement,component){if(DOMElement[component.type]&&DOMElement[component.type]==component){return true;}
if(DOMElement.parentNode){return find(DOMElement.parentNode,component);}
return false;}
var isOpened=function(e){if(jSuites.current.length>0){for(var i=0;i<jSuites.current.length;i++){if(jSuites.current[i]&&!find(e,jSuites.current[i])){jSuites.current[i].close();}}}}
obj.init=function(){var cornerSize=15;var element=null;var editorAction=false;var state={x:null,y:null,}
var editorMouseDown=function(e){var item=jSuites.findElement(e.target,'jpanel');if(item&&!item.classList.contains("readonly")){item.focus();var rect=e.target.getBoundingClientRect();editorAction={e:item,x:e.clientX,y:e.clientY,w:rect.width,h:rect.height,d:item.style.cursor,resizing:item.style.cursor?true:false,}
if(!item.style.width){item.style.width=rect.width+'px';}
if(!item.style.height){item.style.height=rect.height+'px';}
var s=window.getSelection();if(s.rangeCount){for(var i=0;i<s.rangeCount;i++){s.removeRange(s.getRangeAt(i));}}
e.preventDefault();e.stopPropagation();}else{editorAction=false;}
if(e.changedTouches&&e.changedTouches[0]){var x=e.changedTouches[0].clientX;var y=e.changedTouches[0].clientY;}else{var x=e.clientX;var y=e.clientY;}
var path=event.path||(event.composedPath&&event.composedPath());if(path){element=path[0];}else{if(e.target&&e.target.shadowRoot){var d=e.target.shadowRoot;}else{var d=document;}
element=d.elementFromPoint(x,y);}
isOpened(element);}
var editorMouseUp=function(e){if(editorAction&&editorAction.e){if(typeof(editorAction.e.refresh)=='function'){editorAction.e.refresh();}
editorAction.e.style.cursor='';}
state={x:null,y:null,}
editorAction=false;}
var editorMouseMove=function(e){if(editorAction){var x=e.clientX||e.pageX;var y=e.clientY||e.pageY;if(!editorAction.resizing){if(state.x==null&&state.y==null){state.x=x;state.y=y;}
var dx=x-state.x;var dy=y-state.y;var top=editorAction.e.offsetTop+dy;var left=editorAction.e.offsetLeft+dx;editorAction.e.style.top=top+'px';editorAction.e.style.left=left+'px';editorAction.e.style.cursor="move";state.x=x;state.y=y;if(typeof(editorAction.e.refresh)=='function'){editorAction.e.refresh('position',top,left);}}else{var width=null;var height=null;if(editorAction.d=='e-resize'||editorAction.d=='ne-resize'||editorAction.d=='se-resize'){width=editorAction.w+(x-editorAction.x);editorAction.e.style.width=width+'px';if(e.shiftKey){var newHeight=(x-editorAction.x)*(editorAction.h/editorAction.w);height=editorAction.h+newHeight;editorAction.e.style.height=height+'px';}else{var newHeight=false;}}
if(!newHeight){if(editorAction.d=='s-resize'||editorAction.d=='se-resize'||editorAction.d=='sw-resize'){height=editorAction.h+(y-editorAction.y);editorAction.e.style.height=height+'px';}}
if(typeof(editorAction.e.refresh)=='function'){editorAction.e.refresh('dimensions',width,height);}}}else{var item=jSuites.findElement(e.target,'jpanel');if(item){if(item.getAttribute('tabindex')){var rect=item.getBoundingClientRect();if(e.clientY-rect.top<cornerSize){if(rect.width-(e.clientX-rect.left)<cornerSize){item.style.cursor='ne-resize';}else if(e.clientX-rect.left<cornerSize){item.style.cursor='nw-resize';}else{item.style.cursor='n-resize';}}else if(rect.height-(e.clientY-rect.top)<cornerSize){if(rect.width-(e.clientX-rect.left)<cornerSize){item.style.cursor='se-resize';}else if(e.clientX-rect.left<cornerSize){item.style.cursor='sw-resize';}else{item.style.cursor='s-resize';}}else if(rect.width-(e.clientX-rect.left)<cornerSize){item.style.cursor='e-resize';}else if(e.clientX-rect.left<cornerSize){item.style.cursor='w-resize';}else{item.style.cursor='';}}}}}
var editorDblClick=function(e){var item=jSuites.findElement(e.target,'jpanel');if(item&&typeof(item.dblclick)=='function'){item.dblclick(e);}}
var editorContextmenu=function(e){var item=document.activeElement;if(item&&typeof(item.contextmenu)=='function'){item.contextmenu(e);e.preventDefault();e.stopImmediatePropagation();}else{item=jSuites.findElement(e.target,function(o){return o.tagName&&o.getAttribute('aria-contextmenu-id');});if(item){var o=document.querySelector('#'+item);if(!o){console.error('JSUITES: contextmenu id not found: '+item);}else{o.contextmenu.open(e);e.preventDefault();e.stopImmediatePropagation();}}}}
var editorKeyDown=function(e){var item=document.activeElement;if(item){if(e.key=="Delete"&&typeof(item.delete)=='function'){item.delete();e.preventDefault();e.stopImmediatePropagation();}}
if(jSuites.current.length){if(item=jSuites.current[jSuites.current.length-1]){if(e.key=="Escape"&&typeof(item.close)=='function'){item.close();e.preventDefault();e.stopImmediatePropagation();}}}}
document.addEventListener('mouseup',editorMouseUp);document.addEventListener("mousedown",editorMouseDown);document.addEventListener('mousemove',editorMouseMove);document.addEventListener('dblclick',editorDblClick);document.addEventListener('keydown',editorKeyDown);document.addEventListener('contextmenu',editorContextmenu);document.dictionary={};obj.version=version;}
obj.setExtensions=function(o){if(typeof(o)=='object'){var k=Object.keys(o);for(var i=0;i<k.length;i++){obj[k[i]]=o[k[i]];}}}
obj.tracking=function(component,state){if(state==true){jSuites.current=jSuites.current.filter(function(v){return v!==null;});setTimeout(function(){jSuites.current.push(component);},0);}else{var index=jSuites.current.indexOf(component);if(index>=0){jSuites.current.splice(index,1);}}}
obj.path=function(str,val){str=str.split('.');if(str.length){var o=this;var p=null;while(str.length>1){p=str.shift();if(o.hasOwnProperty(p)){o=o[p];}else{if(val===undefined){return undefined;}else{o[p]={};o=o[p];}}}
p=str.shift();if(val!==undefined){o[p]=val;return true;}else{if(o){return o[p];}}}
return false;}
obj.setDictionary=function(d){if(!document.dictionary){document.dictionary={}}
var k=Object.keys(d);for(var i=0;i<k.length;i++){document.dictionary[k[i]]=d[k[i]];}
var t=null;for(var i=0;i<jSuites.calendar.weekdays.length;i++){t=jSuites.translate(jSuites.calendar.weekdays[i]);if(jSuites.calendar.weekdays[i]){jSuites.calendar.weekdays[i]=t;jSuites.calendar.weekdaysShort[i]=t.substr(0,3);}}
for(var i=0;i<jSuites.calendar.months.length;i++){t=jSuites.translate(jSuites.calendar.months[i]);if(t){jSuites.calendar.months[i]=t;jSuites.calendar.monthsShort[i]=t.substr(0,3);}}}
obj.translate=function(t){if(document.dictionary){return document.dictionary[t]||t;}else{return t;}}
obj.current=[];return obj;}();if(typeof(document)!=="undefined"){jSuites.init();}
jSuites.ajax=(function(options,complete){if(Array.isArray(options)){var multiple={instance:[],complete:complete,}
if(options.length>0){for(var i=0;i<options.length;i++){options[i].multiple=multiple;multiple.instance.push(jSuites.ajax(options[i]));}}
return multiple;}
if(!options.data){options.data={};}
if(options.type){options.method=options.type;}
if(!options.method){options.method='GET';}
if(!options.dataType){options.dataType='json';}
if(options.data){var parseData=function(value,key){var vars=[];var keys=Object.keys(value);if(keys.length){for(var i=0;i<keys.length;i++){if(key){var k=key+'['+keys[i]+']';}else{var k=keys[i];}
if(value[k]instanceof FileList){vars[k]=value[keys[i]];}else if(typeof(value[keys[i]])=='object'){var r=parseData(value[keys[i]],k);var o=Object.keys(r);for(var j=0;j<o.length;j++){vars[o[j]]=r[o[j]];}}else{vars[k]=value[keys[i]];}}}
return vars;}
var d=parseData(options.data);var k=Object.keys(d);if(options.method=='GET'){if(k.length){var data=[];for(var i=0;i<k.length;i++){data.push(k[i]+'='+encodeURIComponent(d[k[i]]));}
if(options.url.indexOf('?')<0){options.url+='?';}
options.url+=data.join('&');}}else{var data=new FormData();for(var i=0;i<k.length;i++){if(d[k[i]]instanceof FileList){if(d[k[i]].length){for(var j=0;j<d[k[i]].length;j++){data.append(k[i],d[k[i]][j],d[k[i]][j].name);}}}else{data.append(k[i],d[k[i]]);}}}}
var httpRequest=new XMLHttpRequest();httpRequest.open(options.method,options.url,true);httpRequest.setRequestHeader('X-Requested-With','XMLHttpRequest');if(options.contentType){httpRequest.setRequestHeader('Content-Type',options.contentType);}
if(options.method=='POST'){httpRequest.setRequestHeader('Accept','application/json');}else{if(options.dataType=='blob'){httpRequest.responseType="blob";}else{if(!options.contentType){if(options.dataType=='json'){httpRequest.setRequestHeader('Content-Type','text/json');}else if(options.dataType=='html'){httpRequest.setRequestHeader('Content-Type','text/html');}}}}
if(options.cache!=true){httpRequest.setRequestHeader('pragma','no-cache');httpRequest.setRequestHeader('cache-control','no-cache');}
if(options.withCredentials==true){httpRequest.withCredentials=true}
if(typeof(options.beforeSend)=='function'){options.beforeSend(httpRequest);}
if(typeof(jSuites.ajax.beforeSend)=='function'){jSuites.ajax.beforeSend(httpRequest);}
if(document.ajax&&typeof(document.ajax.beforeSend)=='function'){document.ajax.beforeSend(httpRequest);}
httpRequest.onload=function(){if(httpRequest.status===200){if(options.dataType=='json'){try{var result=JSON.parse(httpRequest.responseText);if(options.success&&typeof(options.success)=='function'){options.success(result);}}catch(err){if(options.error&&typeof(options.error)=='function'){options.error(err,result);}}}else{if(options.dataType=='blob'){var result=httpRequest.response;}else{var result=httpRequest.responseText;}
if(options.success&&typeof(options.success)=='function'){options.success(result);}}}else{if(options.error&&typeof(options.error)=='function'){options.error(httpRequest.responseText,httpRequest.status);}}
if(jSuites.ajax.queue&&jSuites.ajax.queue.length>0){jSuites.ajax.send(jSuites.ajax.queue.shift());}
if(jSuites.ajax.requests&&jSuites.ajax.requests.length){var index=jSuites.ajax.requests.indexOf(httpRequest);jSuites.ajax.requests.splice(index,1);if(!jSuites.ajax.requests.length){if(options.complete&&typeof(options.complete)=='function'){options.complete(result);}}
if(options.group){if(jSuites.ajax.oncomplete&&typeof(jSuites.ajax.oncomplete[options.group])=='function'){if(!jSuites.ajax.pending(options.group)){jSuites.ajax.oncomplete[options.group]();jSuites.ajax.oncomplete[options.group]=null;}}}
if(options.multiple&&options.multiple.instance){var index=options.multiple.instance.indexOf(httpRequest);options.multiple.instance.splice(index,1);if(!options.multiple.instance.length){if(options.multiple.complete&&typeof(options.multiple.complete)=='function'){options.multiple.complete(result);}}}}}
httpRequest.options=options;httpRequest.data=data;if(options.queue==true&&jSuites.ajax.requests.length>0){jSuites.ajax.queue.push(httpRequest);}else{jSuites.ajax.send(httpRequest)}
return httpRequest;});jSuites.ajax.send=function(httpRequest){if(httpRequest.data){if(Array.isArray(httpRequest.data)){httpRequest.send(httpRequest.data.join('&'));}else{httpRequest.send(httpRequest.data);}}else{httpRequest.send();}
jSuites.ajax.requests.push(httpRequest);}
jSuites.ajax.exists=function(url,__callback){var http=new XMLHttpRequest();http.open('HEAD',url,false);http.send();if(http.status){__callback(http.status);}}
jSuites.ajax.pending=function(group){var n=0;var o=jSuites.ajax.requests;if(o&&o.length){for(var i=0;i<o.length;i++){if(!group||group==o[i].options.group){n++}}}
return n;}
jSuites.ajax.oncomplete={};jSuites.ajax.requests=[];jSuites.ajax.queue=[];jSuites.alert=function(message){if(jSuites.getWindowWidth()<800&&jSuites.dialog){jSuites.dialog.open({title:'Alert',message:message,});}else{alert(message);}}
jSuites.animation={};jSuites.animation.slideLeft=function(element,direction,done){if(direction==true){element.classList.add('slide-left-in');setTimeout(function(){element.classList.remove('slide-left-in');if(typeof(done)=='function'){done();}},400);}else{element.classList.add('slide-left-out');setTimeout(function(){element.classList.remove('slide-left-out');if(typeof(done)=='function'){done();}},400);}}
jSuites.animation.slideRight=function(element,direction,done){if(direction==true){element.classList.add('slide-right-in');setTimeout(function(){element.classList.remove('slide-right-in');if(typeof(done)=='function'){done();}},400);}else{element.classList.add('slide-right-out');setTimeout(function(){element.classList.remove('slide-right-out');if(typeof(done)=='function'){done();}},400);}}
jSuites.animation.slideTop=function(element,direction,done){if(direction==true){element.classList.add('slide-top-in');setTimeout(function(){element.classList.remove('slide-top-in');if(typeof(done)=='function'){done();}},400);}else{element.classList.add('slide-top-out');setTimeout(function(){element.classList.remove('slide-top-out');if(typeof(done)=='function'){done();}},400);}}
jSuites.animation.slideBottom=function(element,direction,done){if(direction==true){element.classList.add('slide-bottom-in');setTimeout(function(){element.classList.remove('slide-bottom-in');if(typeof(done)=='function'){done();}},400);}else{element.classList.add('slide-bottom-out');setTimeout(function(){element.classList.remove('slide-bottom-out');if(typeof(done)=='function'){done();}},100);}}
jSuites.animation.fadeIn=function(element,done){element.style.display='';element.classList.add('fade-in');setTimeout(function(){element.classList.remove('fade-in');if(typeof(done)=='function'){done();}},2000);}
jSuites.animation.fadeOut=function(element,done){element.classList.add('fade-out');setTimeout(function(){element.style.display='none';element.classList.remove('fade-out');if(typeof(done)=='function'){done();}},1000);}
jSuites.calendar=(function(el,options){if(el.calendar){return el.calendar.setOptions(options,true);}
var obj={type:'calendar'};obj.options={};obj.date=null;obj.setOptions=function(options,reset){var defaults={type:'default',validRange:null,startingDay:null,format:'DD/MM/YYYY',readonly:true,today:false,time:false,resetButton:true,placeholder:'',months:jSuites.calendar.monthsShort,monthsFull:jSuites.calendar.months,weekdays:jSuites.calendar.weekdays,weekdays_short:jSuites.calendar.weekdays,textDone:jSuites.translate('Done'),textReset:jSuites.translate('Reset'),textUpdate:jSuites.translate('Update'),value:null,fullscreen:false,opened:false,onopen:null,onclose:null,onchange:null,onupdate:null,mode:null,position:null,dataType:null,}
for(var i=0;i<defaults.weekdays_short.length;i++){defaults.weekdays_short[i]=defaults.weekdays_short[i].substr(0,1);}
for(var property in defaults){if(options&&options.hasOwnProperty(property)){obj.options[property]=options[property];}else{if(typeof(obj.options[property])=='undefined'||reset===true){obj.options[property]=defaults[property];}}}
if(obj.options.resetButton==false){calendarReset.style.display='none';}else{calendarReset.style.display='';}
if(obj.options.readonly){el.setAttribute('readonly','readonly');}else{el.removeAttribute('readonly');}
if(obj.options.placeholder){el.setAttribute('placeholder',obj.options.placeholder);}else{el.removeAttribute('placeholder');}
if(jSuites.isNumeric(obj.options.value)&&obj.options.value>0){obj.options.value=jSuites.calendar.numToDate(obj.options.value);obj.options.dataType='numeric';}
calendarReset.innerHTML=obj.options.textReset;calendarConfirm.innerHTML=obj.options.textDone;calendarControlsUpdateButton.innerHTML=obj.options.textUpdate;el.setAttribute('data-mask',obj.options.format.toLowerCase());if(!obj.options.value&&obj.options.today){var value=jSuites.calendar.now();}else{var value=obj.options.value;}
if(value){obj.options.value=null;obj.setValue(value);}
return obj;}
obj.open=function(value){if(!calendar.classList.contains('jcalendar-focus')){if(!calendar.classList.contains('jcalendar-inline')){jSuites.calendar.current=obj;jSuites.tracking(obj,true);obj.getDays();if(obj.options.type=='year-month-picker'){obj.getMonths();}
if(obj.options.time){calendarSelectHour.value=obj.date[3];calendarSelectMin.value=obj.date[4];}
calendar.classList.add('jcalendar-focus');if(jSuites.getWindowWidth()<800||obj.options.fullscreen){calendar.classList.add('jcalendar-fullsize');jSuites.animation.slideBottom(calendarContent,1);}else{calendar.classList.remove('jcalendar-fullsize');var rect=el.getBoundingClientRect();var rectContent=calendarContent.getBoundingClientRect();if(obj.options.position){calendarContainer.style.position='fixed';if(window.innerHeight<rect.bottom+rectContent.height){calendarContainer.style.top=(rect.top-(rectContent.height+2))+'px';}else{calendarContainer.style.top=(rect.top+rect.height+2)+'px';}
calendarContainer.style.left=rect.left+'px';}else{if(window.innerHeight<rect.bottom+rectContent.height){var d=-1*(rect.height+rectContent.height+2);if(d+rect.top<0){d=-1*(rect.top+rect.height);}
calendarContainer.style.top=d+'px';}else{calendarContainer.style.top=2+'px';}
if(window.innerWidth<rect.left+rectContent.width){var d=window.innerWidth-(rect.left+rectContent.width+20);calendarContainer.style.left=d+'px';}else{calendarContainer.style.left='0px';}}}
if(typeof(obj.options.onopen)=='function'){obj.options.onopen(el);}}}}
obj.close=function(ignoreEvents,update){if(calendar.classList.contains('jcalendar-focus')){if(update!==false){var element=calendar.querySelector('.jcalendar-selected');if(typeof(update)=='string'){var value=update;}else if(!element||element.classList.contains('jcalendar-disabled')){var value=obj.options.value}else{var value=obj.getValue();}
obj.setValue(value);}
if(!ignoreEvents&&typeof(obj.options.onclose)=='function'){obj.options.onclose(el);}
calendar.classList.remove('jcalendar-focus');jSuites.tracking(obj,false);jSuites.calendar.current=null;}
return obj.options.value;}
obj.prev=function(){if(obj.options.mode=='years'){obj.date[0]=obj.date[0]-12;obj.getYears();}else if(obj.options.mode=='months'){obj.date[0]=parseInt(obj.date[0])-1;obj.getMonths();}else{if(obj.date[1]<2){obj.date[0]=obj.date[0]-1;obj.date[1]=12;}else{obj.date[1]=obj.date[1]-1;}
obj.getDays();}}
obj.next=function(){if(obj.options.mode=='years'){obj.date[0]=parseInt(obj.date[0])+12;obj.getYears();}else if(obj.options.mode=='months'){obj.date[0]=parseInt(obj.date[0])+1;obj.getMonths();}else{if(obj.date[1]>11){obj.date[0]=parseInt(obj.date[0])+1;obj.date[1]=1;}else{obj.date[1]=parseInt(obj.date[1])+1;}
obj.getDays();}}
obj.setToday=function(){var value=new Date().toISOString().substr(0,10);obj.setValue(value);return value;}
obj.setValue=function(val){if(!val){val=''+val;}
var newValue=val;var oldValue=obj.options.value;if(oldValue!=newValue){if(!newValue){obj.date=null;var val='';}else{var value=obj.setLabel(newValue,obj.options);var date=newValue.split(' ');if(!date[1]){date[1]='00:00:00';}
var time=date[1].split(':')
var date=date[0].split('-');var y=parseInt(date[0]);var m=parseInt(date[1]);var d=parseInt(date[2]);var h=parseInt(time[0]);var i=parseInt(time[1]);obj.date=[y,m,d,h,i,0];var val=obj.setLabel(newValue,obj.options);}
obj.options.value=newValue;if(typeof(obj.options.onchange)=='function'){obj.options.onchange(el,newValue,oldValue);}
if(el.value!=val){el.value=val;if(typeof(el.oninput)=='function'){el.oninput({type:'input',target:el,value:el.value});}}}
obj.getDays();}
obj.getValue=function(){if(obj.date){if(obj.options.time){return jSuites.two(obj.date[0])+'-'+jSuites.two(obj.date[1])+'-'+jSuites.two(obj.date[2])+' '+jSuites.two(obj.date[3])+':'+jSuites.two(obj.date[4])+':'+jSuites.two(0);}else{return jSuites.two(obj.date[0])+'-'+jSuites.two(obj.date[1])+'-'+jSuites.two(obj.date[2])+' '+jSuites.two(0)+':'+jSuites.two(0)+':'+jSuites.two(0);}}else{return "";}}
obj.update=function(element,v){if(element.classList.contains('jcalendar-disabled')){}else{var elements=calendar.querySelector('.jcalendar-selected');if(elements){elements.classList.remove('jcalendar-selected');}
element.classList.add('jcalendar-selected');if(element.classList.contains('jcalendar-set-month')){obj.date[1]=v;obj.date[2]=1;}else{obj.date[2]=element.innerText;}
if(!obj.options.time){obj.close();}else{obj.date[3]=calendarSelectHour.value;obj.date[4]=calendarSelectMin.value;}}
updateActions();}
obj.reset=function(){obj.setValue('');obj.date=null;obj.close(false,false);}
obj.getDays=function(){obj.options.mode='days';var date=new Date();var year=obj.date&&jSuites.isNumeric(obj.date[0])?obj.date[0]:parseInt(date.getFullYear());var month=obj.date&&jSuites.isNumeric(obj.date[1])?obj.date[1]:parseInt(date.getMonth())+1;var day=obj.date&&jSuites.isNumeric(obj.date[2])?obj.date[2]:parseInt(date.getDate());var hour=obj.date&&jSuites.isNumeric(obj.date[3])?obj.date[3]:parseInt(date.getHours());var min=obj.date&&jSuites.isNumeric(obj.date[4])?obj.date[4]:parseInt(date.getMinutes());obj.date=[year,month,day,hour,min,0];calendarLabelYear.innerHTML=year;calendarLabelMonth.innerHTML=obj.options.months[month-1];var isCurrentMonthAndYear=(date.getMonth()==month-1)&&(date.getFullYear()==year)?true:false;var currentDay=date.getDate();var date=new Date(year,month,0,0,0);var numberOfDays=date.getDate();var date=new Date(year,month-1,0,0,0);var firstDay=date.getDay()+1;var index=obj.options.startingDay||0;firstDay=firstDay-index;calendarBody.innerHTML='';var row=document.createElement('tr');row.setAttribute('align','center');calendarBody.appendChild(row);for(var i=0;i<7;i++){var cell=document.createElement('td');cell.classList.add('jcalendar-weekday')
cell.innerHTML=obj.options.weekdays_short[index];row.appendChild(cell);index++;if(index>6){index=0;}}
var index=0;var d=0;for(var j=0;j<6;j++){var row=document.createElement('tr');row.setAttribute('align','center');var emptyRow=true;for(var i=0;i<7;i++){var cell=document.createElement('td');cell.classList.add('jcalendar-set-day');if(index>=firstDay&&index<(firstDay+numberOfDays)){d++;cell.innerHTML=d;if(d==day){cell.classList.add('jcalendar-selected');}
if(isCurrentMonthAndYear&&currentDay==d){cell.style.fontWeight='bold';}
var current=jSuites.calendar.now(new Date(year,month-1,d),true);if(obj.options.validRange){if(!obj.options.validRange[0]||current>=obj.options.validRange[0]){var test1=true;}else{var test1=false;}
if(!obj.options.validRange[1]||current<=obj.options.validRange[1]){var test2=true;}else{var test2=false;}
if(!(test1&&test2)){cell.classList.add('jcalendar-disabled');}}
emptyRow=false;}
row.appendChild(cell);index++;}
if(emptyRow==false){calendarBody.appendChild(row);}}
if(obj.options.time){calendarControlsTime.style.display='';}else{calendarControlsTime.style.display='none';}
updateActions();}
obj.getMonths=function(){obj.options.mode='months';var months=obj.options.months;var value=obj.options.value;var date=new Date();var currentYear=parseInt(date.getFullYear());var currentMonth=parseInt(date.getMonth())+1;var selectedYear=obj.date&&jSuites.isNumeric(obj.date[0])?obj.date[0]:currentYear;var selectedMonth=obj.date&&jSuites.isNumeric(obj.date[1])?obj.date[1]:currentMonth;calendarLabelYear.innerHTML=obj.date[0];calendarLabelMonth.innerHTML=months[selectedMonth-1];var table=document.createElement('table');table.setAttribute('width','100%');var row=null;for(var i=0;i<12;i++){if(!(i%4)){var row=document.createElement('tr');row.setAttribute('align','center');table.appendChild(row);}
var cell=document.createElement('td');cell.classList.add('jcalendar-set-month');cell.setAttribute('data-value',i+1);cell.innerText=months[i];if(obj.options.validRange){var current=selectedYear+'-'+jSuites.two(i+1);if(!obj.options.validRange[0]||current>=obj.options.validRange[0].substr(0,7)){var test1=true;}else{var test1=false;}
if(!obj.options.validRange[1]||current<=obj.options.validRange[1].substr(0,7)){var test2=true;}else{var test2=false;}
if(!(test1&&test2)){cell.classList.add('jcalendar-disabled');}}
if(i+1==selectedMonth){cell.classList.add('jcalendar-selected');}
if(currentYear==selectedYear&&i+1==currentMonth){cell.style.fontWeight='bold';}
row.appendChild(cell);}
calendarBody.innerHTML='<tr><td colspan="7"></td></tr>';calendarBody.children[0].children[0].appendChild(table);updateActions();}
obj.getYears=function(){obj.options.mode='years';var date=new Date();var currentYear=date.getFullYear();var selectedYear=obj.date&&jSuites.isNumeric(obj.date[0])?obj.date[0]:parseInt(date.getFullYear());var y=[];for(var i=0;i<25;i++){y[i]=parseInt(obj.date[0])+(i-12);}
var table=document.createElement('table');table.setAttribute('width','100%');for(var i=0;i<25;i++){if(!(i%5)){var row=document.createElement('tr');row.setAttribute('align','center');table.appendChild(row);}
var cell=document.createElement('td');cell.classList.add('jcalendar-set-year');cell.innerText=y[i];if(selectedYear==y[i]){cell.classList.add('jcalendar-selected');}
if(currentYear==y[i]){cell.style.fontWeight='bold';}
row.appendChild(cell);}
calendarBody.innerHTML='<tr><td colspan="7"></td></tr>';calendarBody.firstChild.firstChild.appendChild(table);updateActions();}
obj.setLabel=function(value,mixed){return jSuites.calendar.getDateString(value,mixed);}
obj.fromFormatted=function(value,format){return jSuites.calendar.extractDateFromString(value,format);}
var mouseUpControls=function(e){var element=jSuites.findElement(e.target,'jcalendar-container');if(element){var action=e.target.className;if(action=='jcalendar-prev'){obj.prev();}else if(action=='jcalendar-next'){obj.next();}else if(action=='jcalendar-month'){obj.getMonths();}else if(action=='jcalendar-year'){obj.getYears();}else if(action=='jcalendar-set-year'){obj.date[0]=e.target.innerText;if(obj.options.type=='year-month-picker'){obj.getMonths();}else{obj.getDays();}}else if(e.target.classList.contains('jcalendar-set-month')){var month=parseInt(e.target.getAttribute('data-value'));if(obj.options.type=='year-month-picker'){obj.update(e.target,month);}else{obj.date[1]=month;obj.getDays();}}else if(action=='jcalendar-confirm'||action=='jcalendar-update'||action=='jcalendar-close'){obj.close();}else if(action=='jcalendar-backdrop'){obj.close(false,false);}else if(action=='jcalendar-reset'){obj.reset();}else if(e.target.classList.contains('jcalendar-set-day')&&e.target.innerText){obj.update(e.target);}}else{obj.close();}}
var keyUpControls=function(e){if(e.target.value&&e.target.value.length>3){var test=jSuites.calendar.extractDateFromString(e.target.value,obj.options.format);if(test){obj.setValue(test);}}}
var updateActions=function(){var currentDay=calendar.querySelector('.jcalendar-selected');if(currentDay&&currentDay.classList.contains('jcalendar-disabled')){calendarControlsUpdateButton.setAttribute('disabled','disabled');calendarSelectHour.setAttribute('disabled','disabled');calendarSelectMin.setAttribute('disabled','disabled');}else{calendarControlsUpdateButton.removeAttribute('disabled');calendarSelectHour.removeAttribute('disabled');calendarSelectMin.removeAttribute('disabled');}
if(typeof(obj.options.onupdate)=='function'){obj.options.onupdate(el,obj.getValue());}}
var calendar=null;var calendarReset=null;var calendarConfirm=null;var calendarContainer=null;var calendarContent=null;var calendarLabelYear=null;var calendarLabelMonth=null;var calendarTable=null;var calendarBody=null;var calendarControls=null;var calendarControlsTime=null;var calendarControlsUpdate=null;var calendarControlsUpdateButton=null;var calendarSelectHour=null;var calendarSelectMin=null;var init=function(){if(el.tagName=='INPUT'&&el.value){options.value=el.value;}
calendarReset=document.createElement('div');calendarReset.className='jcalendar-reset';calendarConfirm=document.createElement('div');calendarConfirm.className='jcalendar-confirm';calendarControls=document.createElement('div');calendarControls.className='jcalendar-controls'
calendarControls.style.borderBottom='1px solid #ddd';calendarControls.appendChild(calendarReset);calendarControls.appendChild(calendarConfirm);calendarContainer=document.createElement('div');calendarContainer.className='jcalendar-container';calendarContent=document.createElement('div');calendarContent.className='jcalendar-content';calendarContainer.appendChild(calendarContent);if(el.tagName=='DIV'){calendar=el;calendar.classList.add('jcalendar-inline');}else{calendarContent.appendChild(calendarControls);calendar=document.createElement('div');calendar.className='jcalendar';}
calendar.classList.add('jcalendar-container');calendar.appendChild(calendarContainer);var calendarTableContainer=document.createElement('div');calendarTableContainer.className='jcalendar-table';calendarContent.appendChild(calendarTableContainer);var calendarHeaderPrev=document.createElement('td');calendarHeaderPrev.setAttribute('colspan','2');calendarHeaderPrev.className='jcalendar-prev';calendarLabelYear=document.createElement('span');calendarLabelYear.className='jcalendar-year';calendarLabelMonth=document.createElement('span');calendarLabelMonth.className='jcalendar-month';var calendarHeaderTitle=document.createElement('td');calendarHeaderTitle.className='jcalendar-header';calendarHeaderTitle.setAttribute('colspan','3');calendarHeaderTitle.appendChild(calendarLabelMonth);calendarHeaderTitle.appendChild(calendarLabelYear);var calendarHeaderNext=document.createElement('td');calendarHeaderNext.setAttribute('colspan','2');calendarHeaderNext.className='jcalendar-next';var calendarHeader=document.createElement('thead');var calendarHeaderRow=document.createElement('tr');calendarHeaderRow.appendChild(calendarHeaderPrev);calendarHeaderRow.appendChild(calendarHeaderTitle);calendarHeaderRow.appendChild(calendarHeaderNext);calendarHeader.appendChild(calendarHeaderRow);calendarTable=document.createElement('table');calendarBody=document.createElement('tbody');calendarTable.setAttribute('cellpadding','0');calendarTable.setAttribute('cellspacing','0');calendarTable.appendChild(calendarHeader);calendarTable.appendChild(calendarBody);calendarTableContainer.appendChild(calendarTable);calendarSelectHour=document.createElement('select');calendarSelectHour.className='jcalendar-select';calendarSelectHour.onchange=function(){obj.date[3]=this.value;if(typeof(obj.options.onupdate)=='function'){obj.options.onupdate(el,obj.getValue());}}
for(var i=0;i<24;i++){var element=document.createElement('option');element.value=i;element.innerHTML=jSuites.two(i);calendarSelectHour.appendChild(element);}
calendarSelectMin=document.createElement('select');calendarSelectMin.className='jcalendar-select';calendarSelectMin.onchange=function(){obj.date[4]=this.value;if(typeof(obj.options.onupdate)=='function'){obj.options.onupdate(el,obj.getValue());}}
for(var i=0;i<60;i++){var element=document.createElement('option');element.value=i;element.innerHTML=jSuites.two(i);calendarSelectMin.appendChild(element);}
var calendarControlsFooter=document.createElement('div');calendarControlsFooter.className='jcalendar-controls';calendarControlsTime=document.createElement('div');calendarControlsTime.className='jcalendar-time';calendarControlsTime.style.maxWidth='140px';calendarControlsTime.appendChild(calendarSelectHour);calendarControlsTime.appendChild(calendarSelectMin);calendarControlsUpdateButton=document.createElement('button');calendarControlsUpdateButton.setAttribute('type','button');calendarControlsUpdateButton.className='jcalendar-update';calendarControlsUpdate=document.createElement('div');calendarControlsUpdate.style.flexGrow='10';calendarControlsUpdate.appendChild(calendarControlsUpdateButton);calendarControlsFooter.appendChild(calendarControlsTime);if(el.tagName=='INPUT'){calendarControlsFooter.appendChild(calendarControlsUpdate);}
calendarContent.appendChild(calendarControlsFooter);var calendarBackdrop=document.createElement('div');calendarBackdrop.className='jcalendar-backdrop';calendar.appendChild(calendarBackdrop);el.addEventListener("keyup",keyUpControls);calendar.addEventListener("swipeleft",function(e){jSuites.animation.slideLeft(calendarTable,0,function(){obj.next();jSuites.animation.slideRight(calendarTable,1);});e.preventDefault();e.stopPropagation();});calendar.addEventListener("swiperight",function(e){jSuites.animation.slideRight(calendarTable,0,function(){obj.prev();jSuites.animation.slideLeft(calendarTable,1);});e.preventDefault();e.stopPropagation();});el.onmouseup=function(){obj.open();}
if('ontouchend'in document.documentElement===true){calendar.addEventListener("touchend",mouseUpControls);}else{calendar.addEventListener("mouseup",mouseUpControls);}
if(!jSuites.calendar.hasEvents){jSuites.calendar.hasEvents=true;document.addEventListener("keydown",jSuites.calendar.keydown);}
obj.setOptions(options);if(el.tagName=='INPUT'){el.parentNode.insertBefore(calendar,el.nextSibling);el.setAttribute('autocomplete','off');el.classList.add('jcalendar-input');el.value=obj.setLabel(obj.getValue(),obj.options);}else{obj.getDays();if(obj.options.time){calendarSelectHour.value=obj.date[3];calendarSelectMin.value=obj.date[4];}}
if(obj.options.opened==true){obj.open();}
el.change=obj.setValue;el.val=function(val){if(val===undefined){return obj.getValue();}else{obj.setValue(val);}}
el.calendar=calendar.calendar=obj;}
init();return obj;});jSuites.calendar.keydown=function(e){var calendar=null;if(calendar=jSuites.calendar.current){if(e.which==13){calendar.close(false,true);}else if(e.which==27){calendar.close(false,false);}}}
jSuites.calendar.prettify=function(d,texts){if(!texts){var texts={justNow:'Just now',xMinutesAgo:'{0}m ago',xHoursAgo:'{0}h ago',xDaysAgo:'{0}d ago',xWeeksAgo:'{0}w ago',xMonthsAgo:'{0} mon ago',xYearsAgo:'{0}y ago',}}
var d1=new Date();var d2=new Date(d);var total=parseInt((d1-d2)/1000/60);String.prototype.format=function(o){return this.replace('{0}',o);}
if(total==0){var text=texts.justNow;}else if(total<90){var text=texts.xMinutesAgo.format(total);}else if(total<1440){var text=texts.xHoursAgo.format(Math.round(total/60));}else if(total<20160){var text=texts.xDaysAgo.format(Math.round(total/1440));}else if(total<43200){var text=texts.xWeeksAgo.format(Math.round(total/10080));}else if(total<1036800){var text=texts.xMonthsAgo.format(Math.round(total/43200));}else{var text=texts.xYearsAgo.format(Math.round(total/525600));}
return text;}
jSuites.calendar.prettifyAll=function(){var elements=document.querySelectorAll('.prettydate');for(var i=0;i<elements.length;i++){if(elements[i].getAttribute('data-date')){elements[i].innerHTML=jSuites.calendar.prettify(elements[i].getAttribute('data-date'));}else{if(elements[i].innerHTML){elements[i].setAttribute('data-date',elements[i].innerHTML);elements[i].innerHTML=jSuites.calendar.prettify(elements[i].innerHTML);}}}}
jSuites.calendar.now=function(date,dateOnly){if(Array.isArray(date)){var y=date[0];var m=date[1];var d=date[2];var h=date[3];var i=date[4];var s=date[5];}else{if(!date){var date=new Date();}
var y=date.getFullYear();var m=date.getMonth()+1;var d=date.getDate();var h=date.getHours();var i=date.getMinutes();var s=date.getSeconds();}
if(dateOnly==true){return jSuites.two(y)+'-'+jSuites.two(m)+'-'+jSuites.two(d);}else{return jSuites.two(y)+'-'+jSuites.two(m)+'-'+jSuites.two(d)+' '+jSuites.two(h)+':'+jSuites.two(i)+':'+jSuites.two(s);}}
jSuites.calendar.toArray=function(value){var date=value.split(((value.indexOf('T')!==-1)?'T':' '));var time=date[1];var date=date[0].split('-');var y=parseInt(date[0]);var m=parseInt(date[1]);var d=parseInt(date[2]);if(time){var time=time.split(':');var h=parseInt(time[0]);var i=parseInt(time[1]);}else{var h=0;var i=0;}
return[y,m,d,h,i,0];}
jSuites.calendar.extractDateFromString=function(date,format){if(date>0&&Number(date)==date){var d=new Date(Math.round((date-25569)*86400*1000));return d.getFullYear()+"-"+jSuites.two(d.getMonth())+"-"+jSuites.two(d.getDate())+' 00:00:00';}
var o=jSuites.mask(date,{mask:format},true);if(o.date[0]&&o.date[1]){if(!o.date[2]){o.date[2]=1;}
return o.date[0]+'-'+jSuites.two(o.date[1])+'-'+jSuites.two(o.date[2])+' '+jSuites.two(o.date[3])+':'+jSuites.two(o.date[4])+':'+jSuites.two(o.date[5]);}
return '';}
var excelInitialTime=Date.UTC(1900,0,0);var excelLeapYearBug=Date.UTC(1900,1,29);var millisecondsPerDay=86400000;jSuites.calendar.dateToNum=function(jsDate){if(typeof(jsDate)==='string'){jsDate=new Date(jsDate+'  GMT+0');}
var jsDateInMilliseconds=jsDate.getTime();if(jsDateInMilliseconds>=excelLeapYearBug){jsDateInMilliseconds+=millisecondsPerDay;}
jsDateInMilliseconds-=excelInitialTime;return jsDateInMilliseconds/millisecondsPerDay;}
jSuites.calendar.numToDate=function(excelSerialNumber){var jsDateInMilliseconds=excelInitialTime+excelSerialNumber*millisecondsPerDay;if(jsDateInMilliseconds>=excelLeapYearBug){jsDateInMilliseconds-=millisecondsPerDay;}
const d=new Date(jsDateInMilliseconds);var date=[d.getUTCFullYear(),d.getUTCMonth()+1,d.getUTCDate(),d.getUTCHours(),d.getUTCMinutes(),d.getUTCSeconds(),];return jSuites.calendar.now(date);}
jSuites.calendar.getDateString=function(value,options){if(!options){var options={};}
if(options&&typeof(options)=='object'){var format=options.format;}else{var format=options;}
if(!format){format='YYYY-MM-DD';}
if(typeof(value)=='number'&&format.indexOf('[h]')>=0){var result=parseFloat(24*Number(value));if(format.indexOf('mm')>=0){var h=(''+result).split('.');if(h[1]){var d=60*parseFloat('0.'+h[1])
d=parseFloat(d.toFixed(2));}else{var d=0;}
result=parseInt(h[0])+':'+jSuites.two(d);}
return result;}
if(value instanceof Date){value=jSuites.calendar.now(value);}else if(value&&jSuites.isNumeric(value)){value=jSuites.calendar.numToDate(value);}
var tokens=['DAY','WD','DDDD','DDD','DD','D','Q','HH24','HH12','HH','H','AM/PM','MI','SS','MS','YYYY','YYY','YY','Y','MONTH','MON','MMMMM','MMMM','MMM','MM','M','.'];var e=new RegExp(tokens.join('|'),'gi');var t=format.match(e);for(var i=0;i<t.length;i++){if(t[i].toUpperCase()=='MM'){if(t[i-1]&&t[i-1].toUpperCase().indexOf('H')>=0){t[i]='mi';}else if(t[i-2]&&t[i-2].toUpperCase().indexOf('H')>=0){t[i]='mi';}else if(t[i+1]&&t[i+1].toUpperCase().indexOf('S')>=0){t[i]='mi';}else if(t[i+2]&&t[i+2].toUpperCase().indexOf('S')>=0){t[i]='mi';}}}
var o={tokens:t}
if(value){var d=''+value;var splitStr=(d.indexOf('T')!==-1)?'T':' ';d=d.split(splitStr);var h=0;var m=0;var s=0;if(d[1]){h=d[1].split(':');m=h[1]?h[1]:0;s=h[2]?h[2]:0;h=h[0]?h[0]:0;}
d=d[0].split('-');if(d[0]&&d[1]&&d[2]&&d[0]>0&&d[1]>0&&d[1]<13&&d[2]>0&&d[2]<32){o.data=[d[0],d[1],d[2],h,m,s];o.value=[];var calendar=new Date(o.data[0],o.data[1]-1,o.data[2],o.data[3],o.data[4],o.data[5]);var get=function(i){var t=this.tokens[i];var s=t.toUpperCase();var v=null;if(s==='YYYY'){v=this.data[0];}else if(s==='YYY'){v=this.data[0].substring(1,4);}else if(s==='YY'){v=this.data[0].substring(2,4);}else if(s==='Y'){v=this.data[0].substring(3,4);}else if(t==='MON'){v=jSuites.calendar.months[calendar.getMonth()].substr(0,3).toUpperCase();}else if(t==='mon'){v=jSuites.calendar.months[calendar.getMonth()].substr(0,3).toLowerCase();}else if(t==='MONTH'){v=jSuites.calendar.months[calendar.getMonth()].toUpperCase();}else if(t==='month'){v=jSuites.calendar.months[calendar.getMonth()].toLowerCase();}else if(s==='MMMMM'){v=jSuites.calendar.months[calendar.getMonth()].substr(0,1);}else if(s==='MMMM'||t==='Month'){v=jSuites.calendar.months[calendar.getMonth()];}else if(s==='MMM'||t=='Mon'){v=jSuites.calendar.months[calendar.getMonth()].substr(0,3);}else if(s==='MM'){v=jSuites.two(this.data[1]);}else if(s==='M'){v=calendar.getMonth()+1;}else if(t==='DAY'){v=jSuites.calendar.weekdays[calendar.getDay()].toUpperCase();}else if(t==='day'){v=jSuites.calendar.weekdays[calendar.getDay()].toLowerCase();}else if(s==='DDDD'||t=='Day'){v=jSuites.calendar.weekdays[calendar.getDay()];}else if(s==='DDD'){v=jSuites.calendar.weekdays[calendar.getDay()].substr(0,3);}else if(s==='DD'){v=jSuites.two(this.data[2]);}else if(s==='D'){v=this.data[2];}else if(s==='Q'){v=Math.floor((calendar.getMonth()+3)/3);}else if(s==='HH24'||s==='HH'){v=jSuites.two(this.data[3]);}else if(s==='HH12'){if(this.data[3]>12){v=jSuites.two(this.data[3]-12);}else{v=jSuites.two(this.data[3]);}}else if(s==='H'){v=this.data[3];}else if(s==='MI'){v=jSuites.two(this.data[4]);}else if(s==='SS'){v=jSuites.two(this.data[5]);}else if(s==='MS'){v=calendar.getMilliseconds();}else if(s==='AM/PM'){if(this.data[3]>=12){v='PM';}else{v='AM';}}else if(s==='WD'){v=jSuites.calendar.weekdays[calendar.getDay()];}
if(v===null){this.value[i]=this.tokens[i];}else{this.value[i]=v;}}
for(var i=0;i<o.tokens.length;i++){get.call(o,i);}
value=o.value.join('');}else{value='';}}
return value;}
jSuites.calendar.weekdays=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];jSuites.calendar.months=['January','February','March','April','May','June','July','August','September','October','November','December'];jSuites.calendar.weekdaysShort=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];jSuites.calendar.monthsShort=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];jSuites.color=(function(el,options){if(el.color){return el.color.setOptions(options,true);}
var obj={type:'color'};obj.options={};var container=null;var backdrop=null;var content=null;var resetButton=null;var closeButton=null;var tabs=null;var jsuitesTabs=null;obj.setOptions=function(options,reset){var defaults={placeholder:'',value:null,onopen:null,onclose:null,onchange:null,closeOnChange:true,palette:null,position:null,doneLabel:'Done',resetLabel:'Reset',fullscreen:false,opened:false,}
if(!options){options={};}
if(options&&!options.palette){options.palette=jSuites.palette();}
for(var property in defaults){if(options&&options.hasOwnProperty(property)){obj.options[property]=options[property];}else{if(typeof(obj.options[property])=='undefined'||reset===true){obj.options[property]=defaults[property];}}}
if(resetButton){resetButton.innerHTML=obj.options.resetLabel;}
if(closeButton){closeButton.innerHTML=obj.options.doneLabel;}
if(obj.options.palette&&jsuitesTabs){jsuitesTabs.updateContent(0,table());}
if(typeof obj.options.value==='string'){el.value=obj.options.value;if(el.tagName==='INPUT'){el.style.color=el.value;el.style.backgroundColor=el.value;}}
if(obj.options.placeholder){el.setAttribute('placeholder',obj.options.placeholder);}else{if(el.getAttribute('placeholder')){el.removeAttribute('placeholder');}}
return obj;}
obj.select=function(color){var selected=container.querySelector('.jcolor-selected');if(selected){selected.classList.remove('jcolor-selected');}
if(obj.values[color]){obj.values[color].classList.add('jcolor-selected');}}
obj.open=function(){if(!container.classList.contains('jcolor-focus')){jSuites.tracking(obj,true);container.classList.add('jcolor-focus');if(obj.options.value){obj.select(obj.options.value);}
content.style.marginTop='';content.style.marginLeft='';var rectContent=content.getBoundingClientRect();var availableWidth=jSuites.getWindowWidth();var availableHeight=jSuites.getWindowHeight();if(availableWidth<800||obj.options.fullscreen==true){content.classList.add('jcolor-fullscreen');jSuites.animation.slideBottom(content,1);backdrop.style.display='block';}else{if(content.classList.contains('jcolor-fullscreen')){content.classList.remove('jcolor-fullscreen');backdrop.style.display='';}
if(obj.options.position){content.style.position='fixed';}else{content.style.position='';}
if(rectContent.left+rectContent.width>availableWidth){content.style.marginLeft=-1*(rectContent.left+rectContent.width-(availableWidth-20))+'px';}
if(rectContent.top+rectContent.height>availableHeight){content.style.marginTop=-1*(rectContent.top+rectContent.height-(availableHeight-20))+'px';}}
if(typeof(obj.options.onopen)=='function'){obj.options.onopen(el);}
jsuitesTabs.setBorder(jsuitesTabs.getActive());if(obj.options.value){var rgb=HexToRgb(obj.options.value);rgbInputs.forEach(function(rgbInput,index){rgbInput.value=rgb[index];rgbInput.dispatchEvent(new Event('input'));});}}}
obj.close=function(ignoreEvents){if(container.classList.contains('jcolor-focus')){container.classList.remove('jcolor-focus');backdrop.style.display='';if(!ignoreEvents&&typeof(obj.options.onclose)=='function'){obj.options.onclose(el);}
jSuites.tracking(obj,false);}
return obj.options.value;}
obj.setValue=function(color){if(!color){color='';}
if(color!=obj.options.value){obj.options.value=color;slidersResult=color;obj.select(color);if(typeof(obj.options.onchange)=='function'){obj.options.onchange(el,color);}
if(el.value!=obj.options.value){el.value=obj.options.value;if(el.tagName==='INPUT'){el.style.color=el.value;el.style.backgroundColor=el.value;}
if(typeof(el.oninput)=='function'){el.oninput({type:'input',target:el,value:el.value});}}
if(obj.options.closeOnChange==true){obj.close();}}}
obj.getValue=function(){return obj.options.value;}
var backdropClickControl=false;var decToHex=function(num){var hex=num.toString(16);return hex.length===1?"0"+hex:hex;}
var rgbToHex=function(r,g,b){return "#"+decToHex(r)+decToHex(g)+decToHex(b);}
var hexToDec=function(hex){return parseInt('0x'+hex);}
var HexToRgb=function(hex){return[hexToDec(hex.substr(1,2)),hexToDec(hex.substr(3,2)),hexToDec(hex.substr(5,2))]}
var table=function(){var tableContainer=document.createElement('div');tableContainer.className='jcolor-grid';obj.values=[];var t=document.createElement('table');t.setAttribute('cellpadding','7');t.setAttribute('cellspacing','0');for(var j=0;j<obj.options.palette.length;j++){var tr=document.createElement('tr');for(var i=0;i<obj.options.palette[j].length;i++){var td=document.createElement('td');var color=obj.options.palette[j][i];if(color.length<7&&color.substr(0,1)!=='#'){color='#'+color;}
td.style.backgroundColor=color;td.setAttribute('data-value',color);td.innerHTML='';tr.appendChild(td);if(obj.options.value==color){td.classList.add('jcolor-selected');}
obj.values[color]=td;}
t.appendChild(tr);}
tableContainer.appendChild(t);return tableContainer;}
var canvas=document.createElement('canvas');canvas.width=200;canvas.height=160;var context=canvas.getContext("2d");var resizeCanvas=function(){var m=tabs.firstChild.getBoundingClientRect();canvas.width=m.width-14;gradient()}
var gradient=function(){var g=context.createLinearGradient(0,0,canvas.width,0);g.addColorStop(0,"rgb(255,0,0)");g.addColorStop(0.15,"rgb(255,0,255)");g.addColorStop(0.33,"rgb(0,0,255)");g.addColorStop(0.49,"rgb(0,255,255)");g.addColorStop(0.67,"rgb(0,255,0)");g.addColorStop(0.84,"rgb(255,255,0)");g.addColorStop(1,"rgb(255,0,0)");context.fillStyle=g;context.fillRect(0,0,canvas.width,canvas.height);g=context.createLinearGradient(0,0,0,canvas.height);g.addColorStop(0,"rgba(255,255,255,1)");g.addColorStop(0.5,"rgba(255,255,255,0)");g.addColorStop(0.5,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(0,0,0,1)");context.fillStyle=g;context.fillRect(0,0,canvas.width,canvas.height);}
var hsl=function(){var element=document.createElement('div');element.className="jcolor-hsl";var point=document.createElement('div');point.className='jcolor-point';var div=document.createElement('div');div.appendChild(canvas);div.appendChild(point);element.appendChild(div);var update=function(buttons,x,y){if(buttons===1){var rect=element.getBoundingClientRect();var left=x-rect.left;var top=y-rect.top;if(left<0){left=0;}
if(top<0){top=0;}
if(left>rect.width){left=rect.width;}
if(top>rect.height){top=rect.height;}
point.style.left=left+'px';point.style.top=top+'px';var pixel=context.getImageData(left,top,1,1).data;slidersResult=rgbToHex(pixel[0],pixel[1],pixel[2]);}}
element.addEventListener('mousedown',function(e){update(e.buttons,e.clientX,e.clientY);});element.addEventListener('mousemove',function(e){update(e.buttons,e.clientX,e.clientY);});element.addEventListener('touchmove',function(e){update(1,e.changedTouches[0].clientX,e.changedTouches[0].clientY);});return element;}
var slidersResult='';var rgbInputs=[];var changeInputColors=function(){if(slidersResult!==''){for(var j=0;j<rgbInputs.length;j++){var currentColor=HexToRgb(slidersResult);currentColor[j]=0;var newGradient='linear-gradient(90deg, rgb(';newGradient+=currentColor.join(', ');newGradient+='), rgb(';currentColor[j]=255;newGradient+=currentColor.join(', ');newGradient+='))';rgbInputs[j].style.backgroundImage=newGradient;}}}
var sliders=function(){var slidersElement=document.createElement('div');slidersElement.className='jcolor-sliders';var slidersBody=document.createElement('div');var createSliderInput=function(name){var inputContainer=document.createElement('div');inputContainer.className='jcolor-sliders-input-container';var label=document.createElement('label');label.innerText=name;var subContainer=document.createElement('div');subContainer.className='jcolor-sliders-input-subcontainer';var input=document.createElement('input');input.type='range';input.min=0;input.max=255;input.value=0;inputContainer.appendChild(label);subContainer.appendChild(input);var value=document.createElement('div');value.innerText=input.value;input.addEventListener('input',function(){value.innerText=input.value;});subContainer.appendChild(value);inputContainer.appendChild(subContainer);slidersBody.appendChild(inputContainer);return input;}
rgbInputs=[createSliderInput('Red'),createSliderInput('Green'),createSliderInput('Blue'),];slidersElement.appendChild(slidersBody);var slidersResultColor=document.createElement('div');slidersResultColor.className='jcolor-sliders-final-color';var resultElement=document.createElement('div');resultElement.style.visibility='hidden';resultElement.innerText='a';slidersResultColor.appendChild(resultElement)
var updateResult=function(){var resultColor=rgbToHex(parseInt(rgbInputs[0].value),parseInt(rgbInputs[1].value),parseInt(rgbInputs[2].value));resultElement.innerText=resultColor;resultElement.style.color=resultColor;resultElement.style.removeProperty('visibility');slidersResult=resultColor;}
rgbInputs.forEach(function(rgbInput){rgbInput.addEventListener('input',function(){updateResult();changeInputColors();});});slidersElement.appendChild(slidersResultColor);return slidersElement;}
var init=function(){obj.setOptions(options);if(el.tagName=='INPUT'){el.classList.add('jcolor-input');el.readOnly=true;}
container=document.createElement('div');container.className='jcolor';backdrop=document.createElement('div');backdrop.className='jcolor-backdrop';container.appendChild(backdrop);content=document.createElement('div');content.className='jcolor-content';var controls=document.createElement('div');controls.className='jcolor-controls';content.appendChild(controls);resetButton=document.createElement('div');resetButton.className='jcolor-reset';resetButton.innerHTML=obj.options.resetLabel;controls.appendChild(resetButton);closeButton=document.createElement('div');closeButton.className='jcolor-close';closeButton.innerHTML=obj.options.doneLabel;controls.appendChild(closeButton);tabs=document.createElement('div');content.appendChild(tabs);jsuitesTabs=jSuites.tabs(tabs,{animation:true,data:[{title:'Grid',contentElement:table(),},{title:'Spectrum',contentElement:hsl(),},{title:'Sliders',contentElement:sliders(),}],onchange:function(element,instance,index){if(index===1){resizeCanvas();}else{var color=slidersResult!==''?slidersResult:obj.getValue();if(index===2&&color){var rgb=HexToRgb(color);rgbInputs.forEach(function(rgbInput,index){rgbInput.value=rgb[index];rgbInput.dispatchEvent(new Event('input'));});}}},palette:'modern',});container.appendChild(content);if(el.tagName=='INPUT'){el.parentNode.insertBefore(container,el.nextSibling);}else{el.appendChild(container);}
container.addEventListener("click",function(e){if(e.target.tagName=='TD'){var value=e.target.getAttribute('data-value');if(value){obj.setValue(value);}}else if(e.target.classList.contains('jcolor-reset')){obj.setValue('');obj.close();}else if(e.target.classList.contains('jcolor-close')){if(jsuitesTabs.getActive()>0){obj.setValue(slidersResult);}
obj.close();}else if(e.target.classList.contains('jcolor-backdrop')){obj.close();}else{obj.open();}});el.addEventListener("mouseup",function(e){obj.open();});window.addEventListener('resize',function(){if(container.classList.contains('jcolor-focus')&&jsuitesTabs.getActive()==1){resizeCanvas();}});if(obj.options.opened==true){obj.open();}
el.change=obj.setValue;el.val=function(val){if(val===undefined){return obj.getValue();}else{obj.setValue(val);}}
el.color=obj;container.color=obj;}
obj.toHex=function(rgb){var hex=function(x){return("0"+parseInt(x).toString(16)).slice(-2);}
if(/^#[0-9A-F]{6}$/i.test(rgb)){return rgb;}else{rgb=rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);return "#"+hex(rgb[1])+hex(rgb[2])+hex(rgb[3]);}}
init();return obj;});jSuites.contextmenu=(function(el,options){var obj={type:'contextmenu'};obj.options={};var defaults={items:null,onclick:null,};for(var property in defaults){if(options&&options.hasOwnProperty(property)){obj.options[property]=options[property];}else{obj.options[property]=defaults[property];}}
el.classList.add('jcontextmenu');obj.open=function(e,items){if(items){obj.options.items=items;obj.create(items);}
if(jSuites.contextmenu.current){jSuites.contextmenu.current.close();}
jSuites.tracking(obj,true);el.classList.add('jcontextmenu-focus');jSuites.contextmenu.current=obj;if((obj.options.items&&obj.options.items.length>0)||el.children.length){if(e.target){var x=e.clientX;var y=e.clientY;}else{var x=e.x;var y=e.y;}
var rect=el.getBoundingClientRect();if(window.innerHeight<y+rect.height){var h=y-rect.height;if(h<0){h=0;}
el.style.top=h+'px';}else{el.style.top=y+'px';}
if(window.innerWidth<x+rect.width){if(x-rect.width>0){el.style.left=(x-rect.width)+'px';}else{el.style.left='10px';}}else{el.style.left=x+'px';}}}
obj.close=function(){if(el.classList.contains('jcontextmenu-focus')){el.classList.remove('jcontextmenu-focus');}
jSuites.tracking(obj,false);}
obj.create=function(items){el.innerHTML='';var itemHeader=createHeader();el.appendChild(itemHeader);for(var i=0;i<items.length;i++){var itemContainer=createItemElement(items[i]);el.appendChild(itemContainer);}}
function createHeader(){var header=document.createElement('div');header.classList.add("header");header.addEventListener("click",function(e){e.preventDefault();e.stopPropagation();});var title=document.createElement('a');title.classList.add("title");title.innerHTML=jSuites.translate("Menu");header.appendChild(title);var closeButton=document.createElement('a');closeButton.classList.add("close");closeButton.innerHTML=jSuites.translate("close");closeButton.addEventListener("click",function(e){obj.close();});header.appendChild(closeButton);return header;}
function createItemElement(item){if(item.type&&(item.type=='line'||item.type=='divisor')){var itemContainer=document.createElement('hr');}else{var itemContainer=document.createElement('div');var itemText=document.createElement('a');itemText.innerHTML=item.title;if(item.tooltip){itemContainer.setAttribute('title',item.tooltip);}
if(item.icon){itemContainer.setAttribute('data-icon',item.icon);}
if(item.id){itemContainer.id=item.id;}
if(item.disabled){itemContainer.className='jcontextmenu-disabled';}else if(item.onclick){itemContainer.method=item.onclick;itemContainer.addEventListener("mousedown",function(e){e.preventDefault();});itemContainer.addEventListener("mouseup",function(e){this.method(this,e);});}
itemContainer.appendChild(itemText);if(item.submenu){var itemIconSubmenu=document.createElement('span');itemIconSubmenu.innerHTML="&#9658;";itemContainer.appendChild(itemIconSubmenu);itemContainer.classList.add('jcontexthassubmenu');var el_submenu=document.createElement('div');el_submenu.classList.add('jcontextmenu');el_submenu.setAttribute('tabindex','900');var submenu=item.submenu;for(var i=0;i<submenu.length;i++){var itemContainerSubMenu=createItemElement(submenu[i]);el_submenu.appendChild(itemContainerSubMenu);}
itemContainer.appendChild(el_submenu);}else if(item.shortcut){var itemShortCut=document.createElement('span');itemShortCut.innerHTML=item.shortcut;itemContainer.appendChild(itemShortCut);}}
return itemContainer;}
if(typeof(obj.options.onclick)=='function'){el.addEventListener('click',function(e){obj.options.onclick(obj,e);});}
if(obj.options.items){obj.create(obj.options.items);}
window.addEventListener("mousewheel",function(){obj.close();});el.contextmenu=obj;return obj;});jSuites.dropdown=(function(el,options){if(el.dropdown){return el.dropdown.setOptions(options,true);}
var obj={type:'dropdown'};obj.options={};var success=function(data,val){if(data&&data.length){if(obj.options.sortResults!==false){if(typeof obj.options.sortResults=="function"){data.sort(obj.options.sortResults);}else{data.sort(sortData);}}
obj.setData(data);}
if(typeof(obj.options.onload)=='function'){obj.options.onload(el,obj,data,val);}
if(val){applyValue(val);}
if(val===undefined||val===null){obj.options.value='';}
el.value=obj.options.value;if(obj.options.opened==true){obj.open();}}
var sortData=function(itemA,itemB){var testA,testB;if(typeof itemA=="string"){testA=itemA;}else{if(itemA.text){testA=itemA.text;}else if(itemA.name){testA=itemA.name;}}
if(typeof itemB=="string"){testB=itemB;}else{if(itemB.text){testB=itemB.text;}else if(itemB.name){testB=itemB.name;}}
if(typeof testA=="string"||typeof testB=="string"){if(typeof testA!="string"){testA=""+testA;}
if(typeof testB!="string"){testB=""+testB;}
return testA.localeCompare(testB);}else{return testA-testB;}}
var resetValue=function(){obj.value={};for(var i=0;i<obj.items.length;i++){if(obj.items[i].selected==true){if(obj.items[i].element){obj.items[i].element.classList.remove('jdropdown-selected')}
obj.items[i].selected=null;}}
obj.options.value='';}
var applyValue=function(values){resetValue();if(values!==null){if(!values){if(typeof(obj.value[''])!=='undefined'){obj.value['']='';}}else{if(!Array.isArray(values)){values=(''+values).split(';');}
for(var i=0;i<values.length;i++){obj.value[values[i]]='';}}}
for(var i=0;i<obj.items.length;i++){if(typeof(obj.value[Value(i)])!=='undefined'){if(obj.items[i].element){obj.items[i].element.classList.add('jdropdown-selected')}
obj.items[i].selected=true;obj.value[Value(i)]=Text(i);}}
obj.options.value=Object.keys(obj.value).join(';');obj.header.value=obj.getText();}
var Value=function(k,v){if(!obj.options.format){var property='value';}else{var property='id';}
if(obj.items[k]){if(v!==undefined){return obj.items[k].data[property]=v;}else{return obj.items[k].data[property];}}
return '';}
var Text=function(k,v){if(!obj.options.format){var property='text';}else{var property='name';}
if(obj.items[k]){if(v!==undefined){return obj.items[k].data[property]=v;}else{return obj.items[k].data[property];}}
return '';}
var getValue=function(){return Object.keys(obj.value);}
var getText=function(){var data=[];var k=Object.keys(obj.value);for(var i=0;i<k.length;i++){data.push(obj.value[k[i]]);}
return data;}
obj.setOptions=function(options,reset){if(!options){options={};}
var defaults={url:null,data:[],format:0,multiple:false,autocomplete:false,remoteSearch:false,lazyLoading:false,type:null,width:null,maxWidth:null,opened:false,value:null,placeholder:'',newOptions:false,position:false,onchange:null,onload:null,onopen:null,onclose:null,onfocus:null,onblur:null,oninsert:null,onbeforeinsert:null,sortResults:false,autofocus:false,}
for(var property in defaults){if(options&&options.hasOwnProperty(property)){obj.options[property]=options[property];}else{if(typeof(obj.options[property])=='undefined'||reset===true){obj.options[property]=defaults[property];}}}
if(obj.options.remoteSearch==true||obj.options.type==='searchbar'){obj.options.autocomplete=true;}
if(obj.options.newOptions==true){obj.header.classList.add('jdropdown-add');}else{obj.header.classList.remove('jdropdown-add');}
if(obj.options.autocomplete==true){obj.header.removeAttribute('readonly');}else{obj.header.setAttribute('readonly','readonly');}
if(obj.options.placeholder){obj.header.setAttribute('placeholder',obj.options.placeholder);}else{obj.header.removeAttribute('placeholder');}
el.classList.remove('jdropdown-searchbar');el.classList.remove('jdropdown-picker');el.classList.remove('jdropdown-list');if(obj.options.type=='searchbar'){el.classList.add('jdropdown-searchbar');}else if(obj.options.type=='list'){el.classList.add('jdropdown-list');}else if(obj.options.type=='picker'){el.classList.add('jdropdown-picker');}else{if(jSuites.getWindowWidth()<800){if(obj.options.autocomplete){el.classList.add('jdropdown-searchbar');obj.options.type='searchbar';}else{el.classList.add('jdropdown-picker');obj.options.type='picker';}}else{if(obj.options.width){el.style.width=obj.options.width;el.style.minWidth=obj.options.width;}else{el.style.removeProperty('width');el.style.removeProperty('min-width');}
el.classList.add('jdropdown-default');obj.options.type='default';}}
if(obj.options.type=='searchbar'){containerHeader.appendChild(closeButton);}else{container.insertBefore(closeButton,container.firstChild);}
if(obj.options.url&&!options.data){jSuites.ajax({url:obj.options.url,method:'GET',dataType:'json',success:function(data){if(data){success(data,obj.options.value);}}});}else{success(obj.options.data,obj.options.value);}
return obj;}
var containerHeader=null;var container=null;var content=null;var closeButton=null;var resetButton=null;var backdrop=null;var keyTimer=null;var init=function(){if(!options){options={};}
if(el.tagName=='SELECT'){var ret=jSuites.dropdown.extractFromDom(el,options);el=ret.el;options=ret.options;}
if(!options.placeholder&&el.getAttribute('placeholder')){options.placeholder=el.getAttribute('placeholder');}
obj.value={};obj.items=[];obj.groups=[];obj.search='';obj.results=null;el.classList.add('jdropdown');containerHeader=document.createElement('div');containerHeader.className='jdropdown-container-header';obj.header=document.createElement('input');obj.header.className='jdropdown-header';obj.header.type='text';obj.header.setAttribute('autocomplete','off');obj.header.onfocus=function(){if(typeof(obj.options.onfocus)=='function'){obj.options.onfocus(el);}}
obj.header.onblur=function(){if(typeof(obj.options.onblur)=='function'){obj.options.onblur(el);}}
obj.header.onkeyup=function(e){if(obj.options.autocomplete==true&&!keyTimer){if(obj.search!=obj.header.value.trim()){keyTimer=setTimeout(function(){obj.find(obj.header.value.trim());keyTimer=null;},400);}
if(!el.classList.contains('jdropdown-focus')){obj.open();}}else{if(!obj.options.autocomplete){obj.next(e.key);}}}
if(!jSuites.dropdown.hasEvents){jSuites.dropdown.hasEvents=true;document.addEventListener("keydown",jSuites.dropdown.keydown);}
container=document.createElement('div');container.className='jdropdown-container';content=document.createElement('div');content.className='jdropdown-content';closeButton=document.createElement('div');closeButton.className='jdropdown-close';closeButton.innerHTML='Done';resetButton=document.createElement('div');resetButton.className='jdropdown-reset';resetButton.innerHTML='x';resetButton.onclick=function(){obj.reset();obj.close();}
backdrop=document.createElement('div');backdrop.className='jdropdown-backdrop';containerHeader.appendChild(obj.header);container.appendChild(content);el.appendChild(containerHeader);el.appendChild(container);el.appendChild(backdrop);obj.setOptions(options);if('ontouchsend'in document.documentElement===true){el.addEventListener('touchsend',jSuites.dropdown.mouseup);}else{el.addEventListener('mouseup',jSuites.dropdown.mouseup);}
if(obj.options.lazyLoading==true){jSuites.lazyLoading(content,{loadUp:obj.loadUp,loadDown:obj.loadDown,});}
content.onwheel=function(e){e.stopPropagation();}
el.change=obj.setValue;el.val=function(val){if(val===undefined){return obj.getValue(obj.options.multiple?true:false);}else{obj.setValue(val);}}
el.dropdown=obj;}
obj.getUrl=function(){return obj.options.url;}
obj.setUrl=function(url,callback){obj.options.url=url;jSuites.ajax({url:obj.options.url,method:'GET',dataType:'json',success:function(data){obj.setData(data);if(typeof(callback)=='function'){callback(obj);}}});}
obj.setId=function(item,v){if(!obj.options.format){var property='value';}else{var property='id';}
if(typeof(item)=='object'){item[property]=v;}else{obj.items[item].data[property]=v;}}
obj.add=function(title,id){if(!title){var current=obj.options.autocomplete==true?obj.header.value:'';var title=prompt(jSuites.translate('Add A New Option'),current);if(!title){return false;}}
if(!id){id=jSuites.guid();}
if(!obj.options.format){var item={value:id,text:title,}}else{var item={id:id,name:title,}}
if(typeof(obj.options.onbeforeinsert)=='function'){var ret=obj.options.onbeforeinsert(obj,item);if(ret===false){return false;}else if(ret){item=ret;}}
obj.options.data.push(item);var newItem=obj.createItem(item);content.appendChild(newItem.element);if(typeof(obj.options.oninsert)=='function'){obj.options.oninsert(obj,item,newItem);}
if(content.style.display=='none'){content.style.display='';}
if(obj.results){obj.results.push(newItem);}
return item;}
obj.createItem=function(data,group,groupName){if(!obj.options.format){if(!data.value&&data.id!==undefined){data.value=data.id;}
if(!data.text&&data.name!==undefined){data.text=data.name;}}else{if(!data.id&&data.value!==undefined){data.id=data.value;}
if(!data.name&&data.text!==undefined){data.name=data.text}}
var item={};item.element=document.createElement('div');item.element.className='jdropdown-item';item.element.indexValue=obj.items.length;item.data=data;if(group){item.group=group;}
if(data.id){item.element.setAttribute('id',data.id);}
if(data.disabled==true){item.element.setAttribute('data-disabled',true);}
if(data.tooltip){item.element.setAttribute('title',data.tooltip);}
if(data.image){var image=document.createElement('img');image.className='jdropdown-image';image.src=data.image;if(!data.title){image.classList.add('jdropdown-image-small');}
item.element.appendChild(image);}else if(data.icon){var icon=document.createElement('span');icon.className="jdropdown-icon material-icons";icon.innerText=data.icon;if(!data.title){icon.classList.add('jdropdown-icon-small');}
if(data.color){icon.style.color=data.color;}
item.element.appendChild(icon);}else if(data.color){var color=document.createElement('div');color.className='jdropdown-color';color.style.backgroundColor=data.color;item.element.appendChild(color);}
if(!obj.options.format){var text=data.text;}else{var text=data.name;}
var node=document.createElement('div');node.className='jdropdown-description';node.innerHTML=text||'&nbsp;';if(data.title){var title=document.createElement('div');title.className='jdropdown-title';title.innerText=data.title;node.appendChild(title);}
if(!obj.options.format){var val=data.value;}else{var val=data.id;}
if(obj.value[val]){item.element.classList.add('jdropdown-selected');item.selected=true;}
obj.items.push(item);item.element.appendChild(node);return item;}
obj.appendData=function(data){if(data.length){var items=[];var groups=[];for(var i=0;i<data.length;i++){if(data[i].group){if(!groups[data[i].group]){groups[data[i].group]=[];}
groups[data[i].group].push(i);}else{items.push(i);}}
var counter=0;var groupNames=Object.keys(groups);if(groupNames.length>0){for(var i=0;i<groupNames.length;i++){var group=document.createElement('div');group.className='jdropdown-group';var groupName=document.createElement('div');groupName.className='jdropdown-group-name';groupName.innerHTML=groupNames[i];var groupArrow=document.createElement('i');groupArrow.className='jdropdown-group-arrow jdropdown-group-arrow-down';groupName.appendChild(groupArrow);var groupContent=document.createElement('div');groupContent.className='jdropdown-group-items';for(var j=0;j<groups[groupNames[i]].length;j++){var item=obj.createItem(data[groups[groupNames[i]][j]],group,groupNames[i]);if(obj.options.lazyLoading==false||counter<200){groupContent.appendChild(item.element);counter++;}}
group.appendChild(groupName);group.appendChild(groupContent);obj.groups.push(group);if(groupContent.children.length>0){content.appendChild(group);}}}
if(items.length){for(var i=0;i<items.length;i++){var item=obj.createItem(data[items[i]]);if(obj.options.lazyLoading==false||counter<200){content.appendChild(item.element);counter++;}}}}}
obj.setData=function(data){if(data.length){for(var i=0;i<data.length;i++){if(typeof(data[i])!='object'){if(!obj.options.format){data[i]={value:data[i],text:data[i]}}else{data[i]={id:data[i],name:data[i]}}}}
resetValue();content.innerHTML='';obj.header.value='';obj.items=[];obj.appendData(data);obj.options.data=data;}}
obj.getData=function(){return obj.options.data;}
obj.getPosition=function(val){for(var i=0;i<obj.items.length;i++){if(Value(i)==val){return i;}}
return false;}
obj.getText=function(asArray){var v=getText();if(asArray){return v;}else{return v.join('; ');}}
obj.getValue=function(asArray){var v=getValue();if(asArray){return v;}else{return v.join(';');}}
var change=function(oldValue){if(el.value!=obj.options.value){el.value=obj.options.value;if(typeof(el.oninput)=='function'){el.oninput({type:'input',target:el,value:el.value});}}
if(typeof(obj.options.onchange)=='function'){obj.options.onchange(el,obj,oldValue,obj.options.value);}}
obj.setValue=function(newValue){var oldValue=obj.getValue();if(Array.isArray(newValue)){newValue=newValue.join(';')}
if(oldValue!==newValue){applyValue(newValue);change(oldValue);}}
obj.resetSelected=function(){obj.setValue(null);}
obj.selectIndex=function(index,force){var index=parseInt(index);if(obj.items&&obj.items[index]&&(force===true||obj.items[index].data.disabled!==true)){obj.setCursor(index,false);if(!obj.options.multiple){if(obj.items[index].selected){obj.setValue(null);}else{obj.setValue(Value(index));}
obj.close();}else{var oldValue=obj.options.value;if(obj.items[index].selected){obj.items[index].element.classList.remove('jdropdown-selected');obj.items[index].selected=false;delete obj.value[Value(index)];}else{obj.items[index].element.classList.add('jdropdown-selected');obj.items[index].selected=true;obj.value[Value(index)]=Text(index);}
obj.options.value=Object.keys(obj.value).join(';');if(obj.options.autocomplete==false){obj.header.value=getText().join('; ');}
change(oldValue);}}}
obj.selectItem=function(item){obj.selectIndex(item.indexValue);}
var exists=function(k,result){for(var j=0;j<result.length;j++){if(!obj.options.format){if(result[j].value==k){return true;}}else{if(result[j].id==k){return true;}}}
return false;}
obj.find=function(str){if(obj.search==str.trim()){return false;}
obj.search=str;obj.setCursor();if(obj.groups.length){for(var i=0;i<obj.groups.length;i++){obj.groups[i].lastChild.innerHTML='';}}
content.innerHTML='';if(obj.options.remoteSearch==true){obj.results=null;var url=obj.options.url+(obj.options.url.indexOf('?')>0?'&':'?')+'q='+str;jSuites.ajax({url:url,method:'GET',dataType:'json',success:function(result){obj.items=[];var current=Object.keys(obj.value);if(current.length){for(var i=0;i<current.length;i++){if(!exists(current[i],result)){if(!obj.options.format){result.unshift({value:current[i],text:obj.value[current[i]]});}else{result.unshift({id:current[i],name:obj.value[current[i]]});}}}}
obj.appendData(result);if(!result.length){content.style.display='none';}else{content.style.display='';}}});}else{str=new RegExp(str,'gi');var results=[];for(var i=0;i<obj.items.length;i++){var label=Text(i);var title=obj.items[i].data.title||'';var groupName=obj.items[i].data.group||'';var synonym=obj.items[i].data.synonym||'';if(synonym){synonym=synonym.join(' ');}
if(str==null||obj.items[i].selected==true||label.match(str)||title.match(str)||groupName.match(str)||synonym.match(str)){results.push(obj.items[i]);}}
if(!results.length){content.style.display='none';obj.results=null;}else{content.style.display='';obj.results=results;var number=results.length||0;if(obj.options.lazyLoading==true&&number>200){number=200;}
for(var i=0;i<number;i++){if(obj.results[i].group){if(!obj.results[i].group.parentNode){content.appendChild(obj.results[i].group);}
obj.results[i].group.lastChild.appendChild(obj.results[i].element);}else{content.appendChild(obj.results[i].element);}}}}
if(obj.options.autofocus==true){obj.first();}}
obj.open=function(){if(!el.classList.contains('jdropdown-focus')){jSuites.dropdown.current=obj;jSuites.tracking(obj,true);el.classList.add('jdropdown-focus');if(jSuites.getWindowWidth()<800){if(obj.options.type==null||obj.options.type=='picker'){jSuites.animation.slideBottom(container,1);}}
if(obj.options.autocomplete==true){obj.header.value=obj.search;obj.header.focus();}
var k=getValue();if(k[0]){var cursor=obj.getPosition(k[0]);if(cursor!==false){obj.setCursor(cursor);}}
if(!obj.options.type||obj.options.type=='default'){var rect=el.getBoundingClientRect();var rectContainer=container.getBoundingClientRect();if(obj.options.position){container.style.position='fixed';if(window.innerHeight<rect.bottom+rectContainer.height){container.style.top='';container.style.bottom=(window.innerHeight-rect.top)+1+'px';}else{container.style.top=rect.bottom+'px';container.style.bottom='';}
container.style.left=rect.left+'px';}else{if(window.innerHeight<rect.bottom+rectContainer.height){container.style.top='';container.style.bottom=rect.height+1+'px';}else{container.style.top='';container.style.bottom='';}}
container.style.minWidth=rect.width+'px';if(obj.options.maxWidth){container.style.maxWidth=obj.options.maxWidth;}
if(!obj.items.length&&obj.options.autocomplete==true){content.style.display='none';}else{content.style.display='';}}}
if(typeof(obj.options.onopen)=='function'){obj.options.onopen(el);}}
obj.close=function(ignoreEvents){if(el.classList.contains('jdropdown-focus')){obj.header.value=obj.getText();obj.setCursor();if(!ignoreEvents&&typeof(obj.options.onclose)=='function'){obj.options.onclose(el);}
if(obj.header.blur){obj.header.blur();}
el.classList.remove('jdropdown-focus');jSuites.tracking(obj,false);jSuites.dropdown.current=null;}
return obj.getValue();}
obj.setCursor=function(index,setPosition){if(obj.currentIndex!=null){if(obj.items&&obj.items[obj.currentIndex]){obj.items[obj.currentIndex].element.classList.remove('jdropdown-cursor');}}
if(index==undefined){obj.currentIndex=null;}else{index=parseInt(index);if(obj.items[index].element.parentNode){obj.items[index].element.classList.add('jdropdown-cursor');obj.currentIndex=index;if(setPosition!==false&&obj.items[obj.currentIndex].element){var container=content.scrollTop;var element=obj.items[obj.currentIndex].element;content.scrollTop=element.offsetTop-element.scrollTop+element.clientTop-95;}}}}
obj.resetCursor=obj.setCursor;obj.updateCursor=obj.setCursor;obj.reset=function(){obj.setCursor();obj.setValue(null);}
obj.first=function(){if(obj.options.lazyLoading===true){obj.loadFirst();}
var items=content.querySelectorAll('.jdropdown-item');if(items.length){var newIndex=items[0].indexValue;obj.setCursor(newIndex);}}
obj.last=function(){if(obj.options.lazyLoading===true){obj.loadLast();}
var items=content.querySelectorAll('.jdropdown-item');if(items.length){var newIndex=items[items.length-1].indexValue;obj.setCursor(newIndex);}}
obj.next=function(letter){var newIndex=null;if(letter){if(letter.length==1){var current=obj.currentIndex||-1;letter=letter.toLowerCase();var e=null;var l=null;var items=content.querySelectorAll('.jdropdown-item');if(items.length){for(var i=0;i<items.length;i++){if(items[i].indexValue>current){if(e=obj.items[items[i].indexValue]){if(l=e.element.innerText[0]){l=l.toLowerCase();if(letter==l){newIndex=items[i].indexValue;break;}}}}}
obj.setCursor(newIndex);}}}else{if(obj.currentIndex==undefined||obj.currentIndex==null){obj.first();}else{var element=obj.items[obj.currentIndex].element;var next=element.nextElementSibling;if(next){if(next.classList.contains('jdropdown-group')){next=next.lastChild.firstChild;}
newIndex=next.indexValue;}else{if(element.parentNode.classList.contains('jdropdown-group-items')){if(next=element.parentNode.parentNode.nextElementSibling){if(next.classList.contains('jdropdown-group')){next=next.lastChild.firstChild;}else if(next.classList.contains('jdropdown-item')){newIndex=next.indexValue;}else{next=null;}}
if(next){newIndex=next.indexValue;}}}
if(newIndex!==null){obj.setCursor(newIndex);}}}}
obj.prev=function(){var newIndex=null;if(obj.currentIndex===null){obj.first();}else{var element=obj.items[obj.currentIndex].element;var prev=element.previousElementSibling;if(prev){if(prev.classList.contains('jdropdown-group')){prev=prev.lastChild.lastChild;}
newIndex=prev.indexValue;}else{if(element.parentNode.classList.contains('jdropdown-group-items')){if(prev=element.parentNode.parentNode.previousElementSibling){if(prev.classList.contains('jdropdown-group')){prev=prev.lastChild.lastChild;}else if(prev.classList.contains('jdropdown-item')){newIndex=prev.indexValue;}else{prev=null}}
if(prev){newIndex=prev.indexValue;}}}}
if(newIndex!==null){obj.setCursor(newIndex);}}
obj.loadFirst=function(){if(obj.results){var results=obj.results;}else{var results=obj.items;}
var number=results.length||0;if(obj.options.lazyLoading==true&&number>200){number=200;}
content.innerHTML='';for(var i=0;i<number;i++){if(results[i].group){if(!results[i].group.parentNode){content.appendChild(results[i].group);}
results[i].group.lastChild.appendChild(results[i].element);}else{content.appendChild(results[i].element);}}
content.scrollTop=0;}
obj.loadLast=function(){if(obj.results){var results=obj.results;}else{var results=obj.items;}
var number=results.length;if(number>200){number=number-200;content.innerHTML='';for(var i=number;i<results.length;i++){if(results[i].group){if(!results[i].group.parentNode){content.appendChild(results[i].group);}
results[i].group.lastChild.appendChild(results[i].element);}else{content.appendChild(results[i].element);}}
content.scrollTop=content.scrollHeight;}}
obj.loadUp=function(){var test=false;if(obj.results){var results=obj.results;}else{var results=obj.items;}
var items=content.querySelectorAll('.jdropdown-item');var fistItem=items[0].indexValue;fistItem=obj.items[fistItem];var index=results.indexOf(fistItem)-1;if(index>0){var number=0;while(index>0&&results[index]&&number<200){if(results[index].group){if(!results[index].group.parentNode){content.insertBefore(results[index].group,content.firstChild);}
results[index].group.lastChild.insertBefore(results[index].element,results[index].group.lastChild.firstChild);}else{content.insertBefore(results[index].element,content.firstChild);}
index--;number++;}
test=true;}
return test;}
obj.loadDown=function(){var test=false;if(obj.results){var results=obj.results;}else{var results=obj.items;}
var items=content.querySelectorAll('.jdropdown-item');var lastItem=items[items.length-1].indexValue;lastItem=obj.items[lastItem];var index=results.indexOf(lastItem)+1;if(index<results.length){var number=0;while(index<results.length&&results[index]&&number<200){if(results[index].group){if(!results[index].group.parentNode){content.appendChild(results[index].group);}
results[index].group.lastChild.appendChild(results[index].element);}else{content.appendChild(results[index].element);}
index++;number++;}
test=true;}
return test;}
init();return obj;});jSuites.dropdown.keydown=function(e){var dropdown=null;if(dropdown=jSuites.dropdown.current){if(e.which==13||e.which==9){if(dropdown.header.value&&dropdown.currentIndex==null&&dropdown.options.newOptions){dropdown.add();}else{if(dropdown.currentIndex==null&&dropdown.options.autocomplete==true&&dropdown.header.value!=""){dropdown.find(dropdown.header.value);}
dropdown.selectIndex(dropdown.currentIndex);}}else if(e.which==38){if(dropdown.currentIndex==null){dropdown.first();}else if(dropdown.currentIndex>0){dropdown.prev();}
e.preventDefault();}else if(e.which==40){if(dropdown.currentIndex==null){dropdown.first();}else if(dropdown.currentIndex+1<dropdown.items.length){dropdown.next();}
e.preventDefault();}else if(e.which==36){dropdown.first();if(!e.target.classList.contains('jdropdown-header')){e.preventDefault();}}else if(e.which==35){dropdown.last();if(!e.target.classList.contains('jdropdown-header')){e.preventDefault();}}else if(e.which==27){dropdown.close();}else if(e.which==33){if(dropdown.currentIndex==null){dropdown.first();}else if(dropdown.currentIndex>0){for(var i=0;i<7;i++){dropdown.prev()}}
e.preventDefault();}else if(e.which==34){if(dropdown.currentIndex==null){dropdown.first();}else if(dropdown.currentIndex+1<dropdown.items.length){for(var i=0;i<7;i++){dropdown.next()}}
e.preventDefault();}}}
jSuites.dropdown.mouseup=function(e){var element=jSuites.findElement(e.target,'jdropdown');if(element){var dropdown=element.dropdown;if(e.target.classList.contains('jdropdown-header')){if(element.classList.contains('jdropdown-focus')&&element.classList.contains('jdropdown-default')){var rect=element.getBoundingClientRect();if(e.changedTouches&&e.changedTouches[0]){var x=e.changedTouches[0].clientX;var y=e.changedTouches[0].clientY;}else{var x=e.clientX;var y=e.clientY;}
if(rect.width-(x-rect.left)<30){if(e.target.classList.contains('jdropdown-add')){dropdown.add();}else{dropdown.close();}}else{if(dropdown.options.autocomplete==false){dropdown.close();}}}else{dropdown.open();}}else if(e.target.classList.contains('jdropdown-group-name')){var items=e.target.nextSibling.children;if(e.target.nextSibling.style.display!='none'){for(var i=0;i<items.length;i++){if(items[i].style.display!='none'){dropdown.selectItem(items[i]);}}}}else if(e.target.classList.contains('jdropdown-group-arrow')){if(e.target.classList.contains('jdropdown-group-arrow-down')){e.target.classList.remove('jdropdown-group-arrow-down');e.target.classList.add('jdropdown-group-arrow-up');e.target.parentNode.nextSibling.style.display='none';}else{e.target.classList.remove('jdropdown-group-arrow-up');e.target.classList.add('jdropdown-group-arrow-down');e.target.parentNode.nextSibling.style.display='';}}else if(e.target.classList.contains('jdropdown-item')){dropdown.selectItem(e.target);}else if(e.target.classList.contains('jdropdown-image')){dropdown.selectItem(e.target.parentNode);}else if(e.target.classList.contains('jdropdown-description')){dropdown.selectItem(e.target.parentNode);}else if(e.target.classList.contains('jdropdown-title')){dropdown.selectItem(e.target.parentNode.parentNode);}else if(e.target.classList.contains('jdropdown-close')||e.target.classList.contains('jdropdown-backdrop')){dropdown.close();}}}
jSuites.dropdown.extractFromDom=function(el,options){var select=el;if(!options){options={};}
if(el.getAttribute('multiple')&&(!options||options.multiple==undefined)){options.multiple=true;}
if(el.getAttribute('placeholder')&&(!options||options.placeholder==undefined)){options.placeholder=el.getAttribute('placeholder');}
if(el.getAttribute('data-autocomplete')&&(!options||options.autocomplete==undefined)){options.autocomplete=true;}
if(!options||options.width==undefined){options.width=el.offsetWidth;}
if(el.value&&(!options||options.value==undefined)){options.value=el.value;}
if(!options||options.data==undefined){options.data=[];for(var j=0;j<el.children.length;j++){if(el.children[j].tagName=='OPTGROUP'){for(var i=0;i<el.children[j].children.length;i++){options.data.push({value:el.children[j].children[i].value,text:el.children[j].children[i].innerHTML,group:el.children[j].getAttribute('label'),});}}else{options.data.push({value:el.children[j].value,text:el.children[j].innerHTML,});}}}
if(!options||options.onchange==undefined){options.onchange=function(a,b,c,d){if(options.multiple==true){if(obj.items[b].classList.contains('jdropdown-selected')){select.options[b].setAttribute('selected','selected');}else{select.options[b].removeAttribute('selected');}}else{select.value=d;}}}
var div=document.createElement('div');el.parentNode.insertBefore(div,el);el.style.display='none';el=div;return{el:el,options:options};}
jSuites.editor=(function(el,options){var obj={type:'editor'};obj.options={};var defaults={value:null,snippet:null,toolbar:null,remoteParser:null,placeholder:null,parseURL:false,filterPaste:true,dropZone:false,dropAsSnippet:false,acceptImages:false,acceptFiles:false,maxFileSize:5000000,allowImageResize:true,border:true,padding:true,maxHeight:null,height:null,focus:false,onclick:null,onfocus:null,onblur:null,onload:null,onkeyup:null,onkeydown:null,onchange:null,userSearch:null,};for(var property in defaults){if(options&&options.hasOwnProperty(property)){obj.options[property]=options[property];}else{obj.options[property]=defaults[property];}}
var imageResize=0;var editorTimer=null;var editorAction=null;var files=[];el.innerHTML='';obj.el=el;if(typeof(obj.options.onclick)=='function'){el.onclick=function(e){obj.options.onclick(el,obj,e);}}
el.classList.add('jeditor-container');if(obj.options.padding==true){el.classList.add('jeditor-padding');}
if(obj.options.border==false){el.style.border='0px';}
var snippet=document.createElement('div');snippet.className='jsnippet';snippet.setAttribute('contenteditable',false);var toolbar=document.createElement('div');toolbar.className='jeditor-toolbar';var editor=document.createElement('div');editor.setAttribute('contenteditable',true);editor.setAttribute('spellcheck',false);editor.className='jeditor';if(obj.options.placeholder){editor.setAttribute('data-placeholder',obj.options.placeholder);}
if(obj.options.maxHeight||obj.options.height){editor.style.overflowY='auto';if(obj.options.maxHeight){editor.style.maxHeight=obj.options.maxHeight;}
if(obj.options.height){editor.style.height=obj.options.height;}}
if(obj.options.value){var value=obj.options.value;}else{var value=el.innerHTML?el.innerHTML:'';}
if(!value){var value='';}
var change=function(e){if(typeof(obj.options.onchange)=='function'){obj.options.onchange(el,obj,e);}
obj.options.value=obj.getData();if(el.value!=obj.options.value){el.value=obj.options.value;if(typeof(el.oninput)=='function'){el.oninput({type:'input',target:el,value:el.value});}}}
var createUserSearchNode=function(){var sel=window.getSelection?window.getSelection():document.selection;var range=sel.getRangeAt(0);range.deleteContents();var input=document.createElement('a');input.innerText='@';input.searchable=true;range.insertNode(input);var node=range.getBoundingClientRect();range.collapse(false);userSearch.style.position='fixed';userSearch.style.top=node.top+node.height+10+'px';userSearch.style.left=node.left+2+'px';}
var extractImageFromHtml=function(html){var div=document.createElement('div');div.innerHTML=html;var img=div.querySelectorAll('img');if(img.length){for(var i=0;i<img.length;i++){obj.addImage(img[i].src);}}}
var insertNodeAtCaret=function(newNode){var sel,range;if(window.getSelection){sel=window.getSelection();if(sel.rangeCount){range=sel.getRangeAt(0);var selectedText=range.toString();range.deleteContents();range.insertNode(newNode);range.setStartAfter(newNode);range.setEndAfter(newNode);sel.removeAllRanges();sel.addRange(range);}}}
var updateTotalImages=function(){var o=null;if(o=snippet.children[0]){if(!o.classList.contains('jslider-grid')){o.classList.add('jslider-grid');}
var number=o.children.length;o.setAttribute('data-number',number>4?4:number);if(number>4){o.setAttribute('data-total',number-4);}else{o.removeAttribute('data-total');}}}
var appendImage=function(image){if(!snippet.innerHTML){appendElement({});}
snippet.children[0].appendChild(image);updateTotalImages();}
var appendElement=function(data){snippet.innerHTML='';var a=['image','title','description','host','url'];for(var i=0;i<a.length;i++){var div=document.createElement('div');div.className='jsnippet-'+a[i];div.setAttribute('data-k',a[i]);snippet.appendChild(div);if(data[a[i]]){if(a[i]=='image'){if(!Array.isArray(data.image)){data.image=[data.image];}
for(var j=0;j<data.image.length;j++){var img=document.createElement('img');img.src=data.image[j];div.appendChild(img);}}else{div.innerHTML=data[a[i]];}}}
editor.appendChild(document.createElement('br'));editor.appendChild(snippet);}
var verifyEditor=function(){clearTimeout(editorTimer);editorTimer=setTimeout(function(){var snippet=editor.querySelector('.jsnippet');if(!snippet){var html=editor.innerHTML.replace(/\n/g,' ');var container=document.createElement('div');container.innerHTML=html;var text=container.innerText;var url=jSuites.editor.detectUrl(text);if(url){if(url[0].substr(-3)=='jpg'||url[0].substr(-3)=='png'||url[0].substr(-3)=='gif'){obj.addImage(url[0],true);}else{var id=jSuites.editor.youtubeParser(url[0]);obj.parseWebsite(url[0],id);}}}},1000);}
obj.parseContent=function(){verifyEditor();}
obj.parseWebsite=function(url,youtubeId){if(!obj.options.remoteParser){console.log('The remoteParser is not defined');}else{if(youtubeId){var url='https://www.youtube.com/watch?v='+youtubeId;}
var p={title:'',description:'',image:'',host:url.split('/')[2],url:url,}
jSuites.ajax({url:obj.options.remoteParser+encodeURI(url.trim()),method:'GET',dataType:'json',success:function(result){if(result.title){p.title=result.title;}
if(result.description){p.description=result.description;}
if(result.host){p.host=result.host;}
if(result.url){p.url=result.url;}
appendElement(p);if(result.image){obj.addImage(result.image,true);}else if(result['og:image']){obj.addImage(result['og:image'],true);}}});}}
obj.setData=function(o){if(typeof(o)=='object'){editor.innerHTML=o.content;}else{editor.innerHTML=o;}
if(obj.options.focus){jSuites.editor.setCursor(editor,true);}
files=[];}
obj.getFiles=function(){var f=editor.querySelectorAll('.jfile');var d=[];for(var i=0;i<f.length;i++){if(files[f[i].src]){d.push(files[f[i].src]);}}
return d;}
obj.getText=function(){return editor.innerText;}
obj.getData=function(json){if(!json){var data=editor.innerHTML;}else{var data={content:'',}
if(snippet.innerHTML){var index=0;data.snippet={};for(var i=0;i<snippet.children.length;i++){var key=snippet.children[i].getAttribute('data-k');if(key){if(key=='image'){if(!data.snippet.image){data.snippet.image=[];}
for(var j=0;j<snippet.children[i].children.length;j++){data.snippet.image.push(snippet.children[i].children[j].getAttribute('src'))}}else{data.snippet[key]=snippet.children[i].innerHTML;}}}}
var f=Object.keys(files);if(f.length){data.files=[];for(var i=0;i<f.length;i++){data.files.push(files[f[i]]);}}
if(userSearch){var tagged=editor.querySelectorAll('a[data-user]');if(tagged.length){data.users=[];for(var i=0;i<tagged.length;i++){var userId=tagged[i].getAttribute('data-user');if(userId){data.users.push(userId);}}
data.users=data.users.join(',');}}
var d=document.createElement('div');d.innerHTML=editor.innerHTML;var s=d.querySelector('.jsnippet');if(s){s.remove();}
var text=d.innerHTML;text=text.replace(/<br>/g,"\n");text=text.replace(/<\/div>/g,"<\/div>\n");text=text.replace(/<(?:.|\n)*?>/gm,"");data.content=text.trim();}
return data;}
obj.reset=function(){editor.innerHTML='';snippet.innerHTML='';files=[];}
obj.addPdf=function(data){if(data.result.substr(0,4)!='data'){console.error('Invalid source');}else{var canvas=document.createElement('canvas');canvas.width=60;canvas.height=60;var img=new Image();var ctx=canvas.getContext('2d');ctx.drawImage(img,0,0,canvas.width,canvas.height);canvas.toBlob(function(blob){var newImage=document.createElement('img');newImage.src=window.URL.createObjectURL(blob);newImage.title=data.name;newImage.className='jfile pdf';files[newImage.src]={file:newImage.src,extension:'pdf',content:data.result,}
insertNodeAtCaret(newImage);});}}
obj.addImage=function(src,asSnippet){if(!src){src='';}
if(src.substr(0,4)!='data'&&!obj.options.remoteParser){console.error('remoteParser not defined in your initialization');}else{if(src.substr(0,4)=='data'){var extension=src.split(';')
extension=extension[0].split('/');extension=extension[1];}else{var extension=src.substr(src.lastIndexOf('.')+1);src=obj.options.remoteParser+src;}
var img=new Image();img.onload=function onload(){var canvas=document.createElement('canvas');canvas.width=img.width;canvas.height=img.height;var ctx=canvas.getContext('2d');ctx.drawImage(img,0,0,canvas.width,canvas.height);canvas.toBlob(function(blob){var newImage=document.createElement('img');newImage.src=window.URL.createObjectURL(blob);newImage.classList.add('jfile');newImage.setAttribute('tabindex','900');files[newImage.src]={file:newImage.src,extension:extension,content:canvas.toDataURL(),}
if(obj.options.dropAsSnippet||asSnippet){appendImage(newImage);files[newImage.src].snippet=true;}else{insertNodeAtCaret(newImage);}
change();});};img.src=src;}}
obj.addFile=function(files){var reader=[];for(var i=0;i<files.length;i++){if(files[i].size>obj.options.maxFileSize){alert('The file is too big');}else{var type=files[i].type.split('/');if(type[0]=='image'){type=1;}else if(type[1]=='pdf'){type=2;}else{type=0;}
if(type){reader[i]=new FileReader();reader[i].index=i;reader[i].type=type;reader[i].name=files[i].name;reader[i].date=files[i].lastModified;reader[i].size=files[i].size;reader[i].addEventListener("load",function(data){if(data.target.type==2){if(obj.options.acceptFiles==true){obj.addPdf(data.target);}}else{obj.addImage(data.target.result);}},false);reader[i].readAsDataURL(files[i])}else{alert('The extension is not allowed');}}}}
obj.destroy=function(){editor.removeEventListener('mouseup',editorMouseUp);editor.removeEventListener('mousedown',editorMouseDown);editor.removeEventListener('mousemove',editorMouseMove);editor.removeEventListener('keyup',editorKeyUp);editor.removeEventListener('keydown',editorKeyDown);editor.removeEventListener('dragstart',editorDragStart);editor.removeEventListener('dragenter',editorDragEnter);editor.removeEventListener('dragover',editorDragOver);editor.removeEventListener('drop',editorDrop);editor.removeEventListener('paste',editorPaste);editor.removeEventListener('blur',editorBlur);editor.removeEventListener('focus',editorFocus);el.editor=null;el.classList.remove('jeditor-container');toolbar.remove();snippet.remove();editor.remove();}
var isLetter=function(str){var regex=/([\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]+)/g;return str.match(regex)?1:0;}
var editorMouseUp=function(e){if(editorAction&&editorAction.e){editorAction.e.classList.remove('resizing');}
editorAction=false;}
var editorMouseDown=function(e){var close=function(snippet){var rect=snippet.getBoundingClientRect();if(rect.width-(e.clientX-rect.left)<40&&e.clientY-rect.top<40){snippet.innerHTML='';snippet.remove();}}
if(e.target.tagName=='IMG'){if(e.target.style.cursor){var rect=e.target.getBoundingClientRect();editorAction={e:e.target,x:e.clientX,y:e.clientY,w:rect.width,h:rect.height,d:e.target.style.cursor,}
if(!e.target.width){e.target.width=rect.width+'px';}
if(!e.target.height){e.target.height=rect.height+'px';}
var s=window.getSelection();if(s.rangeCount){for(var i=0;i<s.rangeCount;i++){s.removeRange(s.getRangeAt(i));}}
e.target.classList.add('resizing');}else{editorAction=true;}}else{if(e.target.classList.contains('jsnippet')){close(e.target);}else if(e.target.parentNode.classList.contains('jsnippet')){close(e.target.parentNode);}
editorAction=true;}}
var editorMouseMove=function(e){if(e.target.tagName=='IMG'&&!e.target.parentNode.classList.contains('jsnippet-image')&&obj.options.allowImageResize==true){if(e.target.getAttribute('tabindex')){var rect=e.target.getBoundingClientRect();if(e.clientY-rect.top<5){if(rect.width-(e.clientX-rect.left)<5){e.target.style.cursor='ne-resize';}else if(e.clientX-rect.left<5){e.target.style.cursor='nw-resize';}else{e.target.style.cursor='n-resize';}}else if(rect.height-(e.clientY-rect.top)<5){if(rect.width-(e.clientX-rect.left)<5){e.target.style.cursor='se-resize';}else if(e.clientX-rect.left<5){e.target.style.cursor='sw-resize';}else{e.target.style.cursor='s-resize';}}else if(rect.width-(e.clientX-rect.left)<5){e.target.style.cursor='e-resize';}else if(e.clientX-rect.left<5){e.target.style.cursor='w-resize';}else{e.target.style.cursor='';}}}
if(e.which==1&&editorAction&&editorAction.d){if(editorAction.d=='e-resize'||editorAction.d=='ne-resize'||editorAction.d=='se-resize'){editorAction.e.width=(editorAction.w+(e.clientX-editorAction.x));if(e.shiftKey){var newHeight=(e.clientX-editorAction.x)*(editorAction.h/editorAction.w);editorAction.e.height=editorAction.h+newHeight;}else{var newHeight=null;}}
if(!newHeight){if(editorAction.d=='s-resize'||editorAction.d=='se-resize'||editorAction.d=='sw-resize'){if(!e.shiftKey){editorAction.e.height=editorAction.h+(e.clientY-editorAction.y);}}}}}
var editorKeyUp=function(e){if(!editor.innerHTML){editor.innerHTML='<div><br></div>';}
if(userSearch){var t=jSuites.getNode();if(t){if(t.searchable===true){if(t.innerText&&t.innerText.substr(0,1)=='@'){userSearchInstance(t.innerText.substr(1));}}else if(t.searchable===false){if(t.innerText!==t.getAttribute('data-label')){t.searchable=true;t.removeAttribute('href');}}}}
if(typeof(obj.options.onkeyup)=='function'){obj.options.onkeyup(el,obj,e);}}
var editorKeyDown=function(e){if(obj.options.parseURL==true){verifyEditor();}
if(userSearch){if(e.key=='@'){createUserSearchNode(editor);e.preventDefault();}else{if(userSearchInstance.isOpened()){userSearchInstance.keydown(e);}}}
if(typeof(obj.options.onkeydown)=='function'){obj.options.onkeydown(el,obj,e);}
if(e.key=='Delete'){if(e.target.tagName=='IMG'&&e.target.parentNode.classList.contains('jsnippet-image')){e.target.remove();updateTotalImages();}}}
var remove=[HTMLUnknownElement,HTMLAudioElement,HTMLEmbedElement,HTMLIFrameElement,HTMLTextAreaElement,HTMLInputElement,HTMLScriptElement];var validProperty=['width','height','align','border','src','tabindex'];var validStyle=['color','font-weight','font-size','background','background-color','margin'];var parse=function(element){if(element.attributes&&element.attributes.length){var image=null;var style=null;var elementStyle=element.getAttribute('style');if(elementStyle){style=[];var t=elementStyle.split(';');for(var j=0;j<t.length;j++){var v=t[j].trim().split(':');if(validStyle.indexOf(v[0].trim())>=0){var k=v.shift();var v=v.join(':');style.push(k+':'+v);}}}
if(element.tagName.toUpperCase()=='IMG'){if(!obj.options.acceptImages||!element.src){element.parentNode.removeChild(element);}else{element.setAttribute('tabindex','900');obj.addImage(element.src);}}
var attr=[];var numAttributes=element.attributes.length-1;if(numAttributes>0){for(var i=numAttributes;i>=0;i--){attr.push(element.attributes[i].name);}
attr.forEach(function(v){if(validProperty.indexOf(v)==-1){element.removeAttribute(v);}});}
element.style='';if(style&&style.length){element.setAttribute('style',style.join(';'));}}
if(element.children.length){for(var i=0;i<element.children.length;i++){parse(element.children[i]);}}
if(remove.indexOf(element.constructor)>=0){element.remove();}}
var filter=function(data){if(data){data=data.replace(new RegExp('<!--(.*?)-->','gsi'),'');}
var parser=new DOMParser();var d=parser.parseFromString(data,"text/html");parse(d);var span=document.createElement('span');span.innerHTML=d.firstChild.innerHTML;return span;}
var editorPaste=function(e){if(obj.options.filterPaste==true){if(e.clipboardData||e.originalEvent.clipboardData){var html=(e.originalEvent||e).clipboardData.getData('text/html');var text=(e.originalEvent||e).clipboardData.getData('text/plain');var file=(e.originalEvent||e).clipboardData.files}else if(window.clipboardData){var html=window.clipboardData.getData('Html');var text=window.clipboardData.getData('Text');var file=window.clipboardData.files}
if(file.length){obj.addFile(file);}else{if(!html){html=text.split('\r\n');if(!e.target.innerText){html.map(function(v){var d=document.createElement('div');d.innerText=v;editor.appendChild(d);});}else{html=html.map(function(v){return '<div>'+v+'</div>';});document.execCommand('insertHtml',false,html.join(''));}}else{var d=filter(html);document.execCommand('insertHtml',false,d.innerHTML);}}
e.preventDefault();}}
var editorDragStart=function(e){if(editorAction&&editorAction.e){e.preventDefault();}}
var editorDragEnter=function(e){if(editorAction||obj.options.dropZone==false){}else{el.classList.add('jeditor-dragging');e.preventDefault();}}
var editorDragOver=function(e){if(editorAction||obj.options.dropZone==false){}else{if(editorTimer){clearTimeout(editorTimer);}
editorTimer=setTimeout(function(){el.classList.remove('jeditor-dragging');},100);e.preventDefault();}}
var editorDrop=function(e){if(editorAction||obj.options.dropZone==false){}else{var range=null;if(document.caretRangeFromPoint){range=document.caretRangeFromPoint(e.clientX,e.clientY);}else if(e.rangeParent){range=document.createRange();range.setStart(e.rangeParent,e.rangeOffset);}
var sel=window.getSelection();sel.removeAllRanges();sel.addRange(range);sel.anchorNode.parentNode.focus();var html=(e.originalEvent||e).dataTransfer.getData('text/html');var text=(e.originalEvent||e).dataTransfer.getData('text/plain');var file=(e.originalEvent||e).dataTransfer.files;if(file.length){obj.addFile(file);}else if(text){extractImageFromHtml(html);}
el.classList.remove('jeditor-dragging');e.preventDefault();}}
var editorBlur=function(e){if(userSearch&&userSearchInstance.isOpened()){userSearchInstance.close();}
if(typeof(obj.options.onblur)=='function'){obj.options.onblur(el,obj,e);}
change(e);}
var editorFocus=function(e){if(typeof(obj.options.onfocus)=='function'){obj.options.onfocus(el,obj,e);}}
editor.addEventListener('mouseup',editorMouseUp);editor.addEventListener('mousedown',editorMouseDown);editor.addEventListener('mousemove',editorMouseMove);editor.addEventListener('keyup',editorKeyUp);editor.addEventListener('keydown',editorKeyDown);editor.addEventListener('dragstart',editorDragStart);editor.addEventListener('dragenter',editorDragEnter);editor.addEventListener('dragover',editorDragOver);editor.addEventListener('drop',editorDrop);editor.addEventListener('paste',editorPaste);editor.addEventListener('focus',editorFocus);editor.addEventListener('blur',editorBlur);if(typeof(obj.options.onload)=='function'){obj.options.onload(el,obj,editor);}
editor.innerHTML=value;el.appendChild(editor);if(obj.options.snippet){appendElement(obj.options.snippet);}
if(obj.options.toolbar==null){obj.options.toolbar=jSuites.editor.getDefaultToolbar();}
if(obj.options.toolbar){el.appendChild(toolbar);jSuites.toolbar(toolbar,{container:true,responsive:true,items:obj.options.toolbar});}
var userSearch=null;var userSearchInstance=null;if(obj.options.userSearch){userSearch=document.createElement('div');el.appendChild(userSearch);userSearchInstance=jSuites.search(userSearch,{data:obj.options.userSearch,placeholder:jSuites.translate('Type the name a user'),onselect:function(a,b,c,d){if(userSearchInstance.isOpened()){var t=jSuites.getNode();if(t&&t.searchable==true&&(t.innerText.trim()&&t.innerText.substr(1))){t.innerText='@'+c;t.href='/'+c;t.setAttribute('data-user',d);t.setAttribute('data-label',t.innerText);t.searchable=false;jSuites.focus(t);}}}});}
if(obj.options.focus){jSuites.editor.setCursor(editor,obj.options.focus=='initial'?true:false);}
el.change=obj.setData;el.val=function(val){if(val===undefined){var o=el.getAttribute('data-html')==='true'?false:true;return obj.getData(o);}else{obj.setData(val);}}
el.editor=obj;return obj;});jSuites.editor.setCursor=function(element,first){element.focus();document.execCommand('selectAll');var sel=window.getSelection();var range=sel.getRangeAt(0);if(first==true){var node=range.startContainer;var size=0;}else{var node=range.endContainer;var size=node.length;}
range.setStart(node,size);range.setEnd(node,size);sel.removeAllRanges();sel.addRange(range);}
jSuites.editor.getDomain=function(url){return url.replace('http://','').replace('https://','').replace('www.','').split(/[/?#]/)[0].split(/:/g)[0];}
jSuites.editor.detectUrl=function(text){var expression=/(((https?:\/\/)|(www\.))[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]+)/ig;var links=text.match(expression);if(links){if(links[0].substr(0,3)=='www'){links[0]='http://'+links[0];}}
return links;}
jSuites.editor.youtubeParser=function(url){var regExp=/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;var match=url.match(regExp);return(match&&match[7].length==11)?match[7]:false;}
jSuites.editor.getDefaultToolbar=function(){return[{content:'undo',onclick:function(){document.execCommand('undo');}},{content:'redo',onclick:function(){document.execCommand('redo');}},{type:'divisor'},{content:'format_bold',onclick:function(a,b,c){document.execCommand('bold');if(document.queryCommandState("bold")){c.classList.add('selected');}else{c.classList.remove('selected');}}},{content:'format_italic',onclick:function(a,b,c){document.execCommand('italic');if(document.queryCommandState("italic")){c.classList.add('selected');}else{c.classList.remove('selected');}}},{content:'format_underline',onclick:function(a,b,c){document.execCommand('underline');if(document.queryCommandState("underline")){c.classList.add('selected');}else{c.classList.remove('selected');}}},{type:'divisor'},{content:'format_list_bulleted',onclick:function(a,b,c){document.execCommand('insertUnorderedList');if(document.queryCommandState("insertUnorderedList")){c.classList.add('selected');}else{c.classList.remove('selected');}}},{content:'format_list_numbered',onclick:function(a,b,c){document.execCommand('insertOrderedList');if(document.queryCommandState("insertOrderedList")){c.classList.add('selected');}else{c.classList.remove('selected');}}},{content:'format_indent_increase',onclick:function(a,b,c){document.execCommand('indent',true,null);if(document.queryCommandState("indent")){c.classList.add('selected');}else{c.classList.remove('selected');}}},{content:'format_indent_decrease',onclick:function(){document.execCommand('outdent');if(document.queryCommandState("outdent")){this.classList.add('selected');}else{this.classList.remove('selected');}}}];}
jSuites.form=(function(el,options){var obj={};obj.options={};var defaults={url:null,message:'Are you sure? There are unsaved information in your form',ignore:false,currentHash:null,submitButton:null,validations:null,onbeforeload:null,onload:null,onbeforesave:null,onsave:null,onbeforeremove:null,onremove:null,onerror:function(el,message){jSuites.alert(message);}};for(var property in defaults){if(options&&options.hasOwnProperty(property)){obj.options[property]=options[property];}else{obj.options[property]=defaults[property];}}
if(!obj.options.validations){obj.options.validations={};}
if(!obj.options.submitButton){obj.options.submitButton=el.querySelector('input[type=submit]');}
if(obj.options.submitButton&&obj.options.url){obj.options.submitButton.onclick=function(){obj.save();}}
if(!obj.options.validations.email){obj.options.validations.email=jSuites.validations.email;}
if(!obj.options.validations.length){obj.options.validations.length=jSuites.validations.length;}
if(!obj.options.validations.required){obj.options.validations.required=jSuites.validations.required;}
obj.setUrl=function(url){obj.options.url=url;}
obj.load=function(){jSuites.ajax({url:obj.options.url,method:'GET',dataType:'json',queue:true,success:function(data){if(typeof(obj.options.onbeforeload)=='function'){var ret=obj.options.onbeforeload(el,data);if(ret){data=ret;}}
jSuites.form.setElements(el,data);if(typeof(obj.options.onload)=='function'){obj.options.onload(el,data);}}});}
obj.save=function(){var test=obj.validate();if(test){obj.options.onerror(el,test);}else{var data=jSuites.form.getElements(el,true);if(typeof(obj.options.onbeforesave)=='function'){var data=obj.options.onbeforesave(el,data);if(data===false){return;}}
jSuites.ajax({url:obj.options.url,method:'POST',dataType:'json',data:data,success:function(result){if(typeof(obj.options.onsave)=='function'){obj.options.onsave(el,data,result);}}});}}
obj.remove=function(){if(typeof(obj.options.onbeforeremove)=='function'){var ret=obj.options.onbeforeremove(el,obj);if(ret===false){return false;}}
jSuites.ajax({url:obj.options.url,method:'DELETE',dataType:'json',success:function(result){if(typeof(obj.options.onremove)=='function'){obj.options.onremove(el,obj,result);}
obj.reset();}});}
var addError=function(element){element.classList.add('error');if(obj.options.submitButton){obj.options.submitButton.setAttribute('disabled',true);}
var error=element.getAttribute('data-error')||'There is an error in the form';element.setAttribute('title',error);return error;}
var delError=function(element){var error=false;element.classList.remove('error');element.removeAttribute('title');var elements=el.querySelectorAll("input, select, textarea, div[name]");for(var i=0;i<elements.length;i++){if(elements[i].getAttribute('data-validation')){if(elements[i].classList.contains('error')){error=true;}}}
if(obj.options.submitButton){if(error){obj.options.submitButton.setAttribute('disabled',true);}else{obj.options.submitButton.removeAttribute('disabled');}}}
obj.validateElement=function(element){var test=false;var value=jSuites.form.getValue(element);var validation=element.getAttribute('data-validation');if(typeof(obj.options.validations[validation])=='function'&&!obj.options.validations[validation](value,element)){test=addError(element);}else{if(element.classList.contains('error')){delError(element);}}
return test;}
obj.reset=function(){var name=null;var elements=el.querySelectorAll("input, select, textarea, div[name]");for(var i=0;i<elements.length;i++){if(name=elements[i].getAttribute('name')){if(elements[i].type=='checkbox'||elements[i].type=='radio'){elements[i].checked=false;}else{if(typeof(elements[i].val)=='function'){elements[i].val('');}else{elements[i].value='';}}}}}
obj.validate=function(){var test=[];var elements=el.querySelectorAll("input, select, textarea, div[name]");for(var i=0;i<elements.length;i++){if(elements[i].getAttribute('data-validation')){var res=obj.validateElement(elements[i]);if(res){test.push(res);}}}
if(test.length>0){return test.join('<br>');}else{return false;}}
obj.getError=function(){return obj.validation()?true:false;}
obj.setHash=function(){return obj.getHash(jSuites.form.getElements(el));}
obj.getHash=function(str){var hash=0,i,chr;if(str.length===0){return hash;}else{for(i=0;i<str.length;i++){chr=str.charCodeAt(i);hash=((hash<<5)-hash)+chr;hash|=0;}}
return hash;}
obj.isChanged=function(){var hash=obj.setHash();return(obj.options.currentHash!=hash);}
obj.resetTracker=function(){obj.options.currentHash=obj.setHash();obj.options.ignore=false;}
obj.setIgnore=function(ignoreFlag){obj.options.ignore=ignoreFlag?true:false;}
setTimeout(function(){obj.options.currentHash=obj.setHash();},1000);el.addEventListener("keyup",function(e){if(e.target.getAttribute('data-validation')){obj.validateElement(e.target);}});if(!jSuites.form.hasEvents){window.addEventListener("beforeunload",function(e){if(obj.isChanged()&&obj.options.ignore==false){var confirmationMessage=obj.options.message?obj.options.message:"\o/";if(confirmationMessage){if(typeof e=='undefined'){e=window.event;}
if(e){e.returnValue=confirmationMessage;}
return confirmationMessage;}else{return void(0);}}});jSuites.form.hasEvents=true;}
el.form=obj;return obj;});jSuites.form.getValue=function(element){var value=null;if(element.type=='checkbox'){if(element.checked==true){value=element.value||true;}}else if(element.type=='radio'){if(element.checked==true){value=element.value;}}else if(element.type=='file'){value=element.files;}else if(element.tagName=='select'&&element.multiple==true){value=[];var options=element.querySelectorAll("options[selected]");for(var j=0;j<options.length;j++){value.push(options[j].value);}}else if(typeof(element.val)=='function'){value=element.val();}else{value=element.value||'';}
return value;}
jSuites.form.getElements=function(el,asArray){var data={};var name=null;var elements=el.querySelectorAll("input, select, textarea, div[name]");for(var i=0;i<elements.length;i++){if(name=elements[i].getAttribute('name')){data[name]=jSuites.form.getValue(elements[i])||'';}}
return asArray==true?data:JSON.stringify(data);}
jSuites.form.setElements=function(el,data){var name=null;var value=null;var elements=el.querySelectorAll("input, select, textarea, div[name]");for(var i=0;i<elements.length;i++){var type=elements[i].getAttribute('type');if(name=elements[i].getAttribute('name')){name=name.replace(new RegExp(/\[(.*?)\]/ig),'.$1');value=null;if(name.match(/\./)){var tmp=jSuites.path.call(data,name)||'';if(typeof(tmp)!=='undefined'){value=tmp;}}else{if(typeof(data[name])!=='undefined'){value=data[name];}}
if(value!==null){if(type=='checkbox'||type=='radio'){elements[i].checked=value?true:false;}else if(type=='file'){}else{if(typeof(elements[i].val)=='function'){elements[i].val(value);}else{elements[i].value=value;}}}}}}
jSuites.tracker=jSuites.form;jSuites.focus=function(el){if(el.innerText.length){var range=document.createRange();var sel=window.getSelection();var node=el.childNodes[el.childNodes.length-1];range.setStart(node,node.length)
range.collapse(true)
sel.removeAllRanges()
sel.addRange(range)
el.scrollLeft=el.scrollWidth;}}
jSuites.isNumeric=(function(num){return!isNaN(num)&&num!==null&&num!=='';});jSuites.guid=function(){return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){var r=Math.random()*16|0,v=c=='x'?r:(r&0x3|0x8);return v.toString(16);});}
jSuites.getNode=function(){var node=document.getSelection().anchorNode;if(node){return(node.nodeType==3?node.parentNode:node);}else{return null;}}
jSuites.hash=function(str){var hash=0,i,chr;if(str.length===0){return hash;}else{for(i=0;i<str.length;i++){chr=str.charCodeAt(i);if(chr>32){hash=((hash<<5)-hash)+chr;hash|=0;}}}
return hash;}
jSuites.randomColor=function(h){var lum=-0.25;var hex=String('#'+Math.random().toString(16).slice(2,8).toUpperCase()).replace(/[^0-9a-f]/gi,'');if(hex.length<6){hex=hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];}
var rgb=[],c,i;for(i=0;i<3;i++){c=parseInt(hex.substr(i*2,2),16);c=Math.round(Math.min(Math.max(0,c+(c*lum)),255)).toString(16);rgb.push(("00"+c).substr(c.length));}
if(h==true){return '#'+jSuites.two(rgb[0].toString(16))+jSuites.two(rgb[1].toString(16))+jSuites.two(rgb[2].toString(16));}
return rgb;}
jSuites.getWindowWidth=function(){var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth;return x;}
jSuites.getWindowHeight=function(){var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],y=w.innerHeight||e.clientHeight||g.clientHeight;return y;}
jSuites.getPosition=function(e){if(e.changedTouches&&e.changedTouches[0]){var x=e.changedTouches[0].pageX;var y=e.changedTouches[0].pageY;}else{var x=(window.Event)?e.pageX:e.clientX+(document.documentElement.scrollLeft?document.documentElement.scrollLeft:document.body.scrollLeft);var y=(window.Event)?e.pageY:e.clientY+(document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop);}
return[x,y];}
jSuites.click=function(el){if(el.click){el.click();}else{var evt=new MouseEvent('click',{bubbles:true,cancelable:true,view:window});el.dispatchEvent(evt);}}
jSuites.findElement=function(element,condition){var foundElement=false;function path(element){if(element&&!foundElement){if(typeof(condition)=='function'){foundElement=condition(element)}else if(typeof(condition)=='string'){if(element.classList&&element.classList.contains(condition)){foundElement=element;}}}
if(element.parentNode&&!foundElement){path(element.parentNode);}}
path(element);return foundElement;}
jSuites.two=function(value){value=''+value;if(value.length==1){value='0'+value;}
return value;}
jSuites.sha512=(function(str){function int64(msint_32,lsint_32){this.highOrder=msint_32;this.lowOrder=lsint_32;}
var H=[new int64(0x6a09e667,0xf3bcc908),new int64(0xbb67ae85,0x84caa73b),new int64(0x3c6ef372,0xfe94f82b),new int64(0xa54ff53a,0x5f1d36f1),new int64(0x510e527f,0xade682d1),new int64(0x9b05688c,0x2b3e6c1f),new int64(0x1f83d9ab,0xfb41bd6b),new int64(0x5be0cd19,0x137e2179)];var K=[new int64(0x428a2f98,0xd728ae22),new int64(0x71374491,0x23ef65cd),new int64(0xb5c0fbcf,0xec4d3b2f),new int64(0xe9b5dba5,0x8189dbbc),new int64(0x3956c25b,0xf348b538),new int64(0x59f111f1,0xb605d019),new int64(0x923f82a4,0xaf194f9b),new int64(0xab1c5ed5,0xda6d8118),new int64(0xd807aa98,0xa3030242),new int64(0x12835b01,0x45706fbe),new int64(0x243185be,0x4ee4b28c),new int64(0x550c7dc3,0xd5ffb4e2),new int64(0x72be5d74,0xf27b896f),new int64(0x80deb1fe,0x3b1696b1),new int64(0x9bdc06a7,0x25c71235),new int64(0xc19bf174,0xcf692694),new int64(0xe49b69c1,0x9ef14ad2),new int64(0xefbe4786,0x384f25e3),new int64(0x0fc19dc6,0x8b8cd5b5),new int64(0x240ca1cc,0x77ac9c65),new int64(0x2de92c6f,0x592b0275),new int64(0x4a7484aa,0x6ea6e483),new int64(0x5cb0a9dc,0xbd41fbd4),new int64(0x76f988da,0x831153b5),new int64(0x983e5152,0xee66dfab),new int64(0xa831c66d,0x2db43210),new int64(0xb00327c8,0x98fb213f),new int64(0xbf597fc7,0xbeef0ee4),new int64(0xc6e00bf3,0x3da88fc2),new int64(0xd5a79147,0x930aa725),new int64(0x06ca6351,0xe003826f),new int64(0x14292967,0x0a0e6e70),new int64(0x27b70a85,0x46d22ffc),new int64(0x2e1b2138,0x5c26c926),new int64(0x4d2c6dfc,0x5ac42aed),new int64(0x53380d13,0x9d95b3df),new int64(0x650a7354,0x8baf63de),new int64(0x766a0abb,0x3c77b2a8),new int64(0x81c2c92e,0x47edaee6),new int64(0x92722c85,0x1482353b),new int64(0xa2bfe8a1,0x4cf10364),new int64(0xa81a664b,0xbc423001),new int64(0xc24b8b70,0xd0f89791),new int64(0xc76c51a3,0x0654be30),new int64(0xd192e819,0xd6ef5218),new int64(0xd6990624,0x5565a910),new int64(0xf40e3585,0x5771202a),new int64(0x106aa070,0x32bbd1b8),new int64(0x19a4c116,0xb8d2d0c8),new int64(0x1e376c08,0x5141ab53),new int64(0x2748774c,0xdf8eeb99),new int64(0x34b0bcb5,0xe19b48a8),new int64(0x391c0cb3,0xc5c95a63),new int64(0x4ed8aa4a,0xe3418acb),new int64(0x5b9cca4f,0x7763e373),new int64(0x682e6ff3,0xd6b2b8a3),new int64(0x748f82ee,0x5defb2fc),new int64(0x78a5636f,0x43172f60),new int64(0x84c87814,0xa1f0ab72),new int64(0x8cc70208,0x1a6439ec),new int64(0x90befffa,0x23631e28),new int64(0xa4506ceb,0xde82bde9),new int64(0xbef9a3f7,0xb2c67915),new int64(0xc67178f2,0xe372532b),new int64(0xca273ece,0xea26619c),new int64(0xd186b8c7,0x21c0c207),new int64(0xeada7dd6,0xcde0eb1e),new int64(0xf57d4f7f,0xee6ed178),new int64(0x06f067aa,0x72176fba),new int64(0x0a637dc5,0xa2c898a6),new int64(0x113f9804,0xbef90dae),new int64(0x1b710b35,0x131c471b),new int64(0x28db77f5,0x23047d84),new int64(0x32caab7b,0x40c72493),new int64(0x3c9ebe0a,0x15c9bebc),new int64(0x431d67c4,0x9c100d4c),new int64(0x4cc5d4be,0xcb3e42b6),new int64(0x597f299c,0xfc657e2a),new int64(0x5fcb6fab,0x3ad6faec),new int64(0x6c44198c,0x4a475817)];var W=new Array(64);var a,b,c,d,e,f,g,h,i,j;var T1,T2;var charsize=8;function utf8_encode(str){return unescape(encodeURIComponent(str));}
function str2binb(str){var bin=[];var mask=(1<<charsize)-1;var len=str.length*charsize;for(var i=0;i<len;i+=charsize){bin[i>>5]|=(str.charCodeAt(i/charsize)&mask)<<(32-charsize-(i%32));}
return bin;}
function binb2hex(binarray){var hex_tab="0123456789abcdef";var str="";var length=binarray.length*4;var srcByte;for(var i=0;i<length;i+=1){srcByte=binarray[i>>2]>>((3-(i%4))*8);str+=hex_tab.charAt((srcByte>>4)&0xF)+hex_tab.charAt(srcByte&0xF);}
return str;}
function safe_add_2(x,y){var lsw,msw,lowOrder,highOrder;lsw=(x.lowOrder&0xFFFF)+(y.lowOrder&0xFFFF);msw=(x.lowOrder>>>16)+(y.lowOrder>>>16)+(lsw>>>16);lowOrder=((msw&0xFFFF)<<16)|(lsw&0xFFFF);lsw=(x.highOrder&0xFFFF)+(y.highOrder&0xFFFF)+(msw>>>16);msw=(x.highOrder>>>16)+(y.highOrder>>>16)+(lsw>>>16);highOrder=((msw&0xFFFF)<<16)|(lsw&0xFFFF);return new int64(highOrder,lowOrder);}
function safe_add_4(a,b,c,d){var lsw,msw,lowOrder,highOrder;lsw=(a.lowOrder&0xFFFF)+(b.lowOrder&0xFFFF)+(c.lowOrder&0xFFFF)+(d.lowOrder&0xFFFF);msw=(a.lowOrder>>>16)+(b.lowOrder>>>16)+(c.lowOrder>>>16)+(d.lowOrder>>>16)+(lsw>>>16);lowOrder=((msw&0xFFFF)<<16)|(lsw&0xFFFF);lsw=(a.highOrder&0xFFFF)+(b.highOrder&0xFFFF)+(c.highOrder&0xFFFF)+(d.highOrder&0xFFFF)+(msw>>>16);msw=(a.highOrder>>>16)+(b.highOrder>>>16)+(c.highOrder>>>16)+(d.highOrder>>>16)+(lsw>>>16);highOrder=((msw&0xFFFF)<<16)|(lsw&0xFFFF);return new int64(highOrder,lowOrder);}
function safe_add_5(a,b,c,d,e){var lsw,msw,lowOrder,highOrder;lsw=(a.lowOrder&0xFFFF)+(b.lowOrder&0xFFFF)+(c.lowOrder&0xFFFF)+(d.lowOrder&0xFFFF)+(e.lowOrder&0xFFFF);msw=(a.lowOrder>>>16)+(b.lowOrder>>>16)+(c.lowOrder>>>16)+(d.lowOrder>>>16)+(e.lowOrder>>>16)+(lsw>>>16);lowOrder=((msw&0xFFFF)<<16)|(lsw&0xFFFF);lsw=(a.highOrder&0xFFFF)+(b.highOrder&0xFFFF)+(c.highOrder&0xFFFF)+(d.highOrder&0xFFFF)+(e.highOrder&0xFFFF)+(msw>>>16);msw=(a.highOrder>>>16)+(b.highOrder>>>16)+(c.highOrder>>>16)+(d.highOrder>>>16)+(e.highOrder>>>16)+(lsw>>>16);highOrder=((msw&0xFFFF)<<16)|(lsw&0xFFFF);return new int64(highOrder,lowOrder);}
function maj(x,y,z){return new int64((x.highOrder&y.highOrder)^(x.highOrder&z.highOrder)^(y.highOrder&z.highOrder),(x.lowOrder&y.lowOrder)^(x.lowOrder&z.lowOrder)^(y.lowOrder&z.lowOrder));}
function ch(x,y,z){return new int64((x.highOrder&y.highOrder)^(~x.highOrder&z.highOrder),(x.lowOrder&y.lowOrder)^(~x.lowOrder&z.lowOrder));}
function rotr(x,n){if(n<=32){return new int64((x.highOrder>>>n)|(x.lowOrder<<(32-n)),(x.lowOrder>>>n)|(x.highOrder<<(32-n)));}else{return new int64((x.lowOrder>>>n)|(x.highOrder<<(32-n)),(x.highOrder>>>n)|(x.lowOrder<<(32-n)));}}
function sigma0(x){var rotr28=rotr(x,28);var rotr34=rotr(x,34);var rotr39=rotr(x,39);return new int64(rotr28.highOrder^rotr34.highOrder^rotr39.highOrder,rotr28.lowOrder^rotr34.lowOrder^rotr39.lowOrder);}
function sigma1(x){var rotr14=rotr(x,14);var rotr18=rotr(x,18);var rotr41=rotr(x,41);return new int64(rotr14.highOrder^rotr18.highOrder^rotr41.highOrder,rotr14.lowOrder^rotr18.lowOrder^rotr41.lowOrder);}
function gamma0(x){var rotr1=rotr(x,1),rotr8=rotr(x,8),shr7=shr(x,7);return new int64(rotr1.highOrder^rotr8.highOrder^shr7.highOrder,rotr1.lowOrder^rotr8.lowOrder^shr7.lowOrder);}
function gamma1(x){var rotr19=rotr(x,19);var rotr61=rotr(x,61);var shr6=shr(x,6);return new int64(rotr19.highOrder^rotr61.highOrder^shr6.highOrder,rotr19.lowOrder^rotr61.lowOrder^shr6.lowOrder);}
function shr(x,n){if(n<=32){return new int64(x.highOrder>>>n,x.lowOrder>>>n|(x.highOrder<<(32-n)));}else{return new int64(0,x.highOrder<<(32-n));}}
var str=utf8_encode(str);var strlen=str.length*charsize;str=str2binb(str);str[strlen>>5]|=0x80<<(24-strlen%32);str[(((strlen+128)>>10)<<5)+31]=strlen;for(var i=0;i<str.length;i+=32){a=H[0];b=H[1];c=H[2];d=H[3];e=H[4];f=H[5];g=H[6];h=H[7];for(var j=0;j<80;j++){if(j<16){W[j]=new int64(str[j*2+i],str[j*2+i+1]);}else{W[j]=safe_add_4(gamma1(W[j-2]),W[j-7],gamma0(W[j-15]),W[j-16]);}
T1=safe_add_5(h,sigma1(e),ch(e,f,g),K[j],W[j]);T2=safe_add_2(sigma0(a),maj(a,b,c));h=g;g=f;f=e;e=safe_add_2(d,T1);d=c;c=b;b=a;a=safe_add_2(T1,T2);}
H[0]=safe_add_2(a,H[0]);H[1]=safe_add_2(b,H[1]);H[2]=safe_add_2(c,H[2]);H[3]=safe_add_2(d,H[3]);H[4]=safe_add_2(e,H[4]);H[5]=safe_add_2(f,H[5]);H[6]=safe_add_2(g,H[6]);H[7]=safe_add_2(h,H[7]);}
var binarray=[];for(var i=0;i<H.length;i++){binarray.push(H[i].highOrder);binarray.push(H[i].lowOrder);}
return binb2hex(binarray);});if(!jSuites.login){jSuites.login={};jSuites.login.sha512=jSuites.sha512;}
jSuites.image=jSuites.upload=(function(el,options){var obj={};obj.options={};var defaults={type:'image',extension:'*',input:false,minWidth:false,maxWidth:null,maxHeight:null,maxJpegSizeBytes:null,onchange:null,multiple:false,remoteParser:null,text:{extensionNotAllowed:'The extension is not allowed',}};for(var property in defaults){if(options&&options.hasOwnProperty(property)){obj.options[property]=options[property];}else{obj.options[property]=defaults[property];}}
if(obj.options.multiple==true){el.setAttribute('data-multiple',true);}
el.content=[];el.classList.add('jupload');if(obj.options.input==true){el.classList.add('input');}
obj.add=function(data){if(obj.options.multiple==false){el.content=[];el.innerText='';}
if(obj.options.type=='image'){var img=document.createElement('img');img.setAttribute('src',data.file);img.setAttribute('tabindex',-1);if(!el.getAttribute('name')){img.className='jfile';img.content=data;}
el.appendChild(img);}else{if(data.name){var name=data.name;}else{var name=data.file;}
var div=document.createElement('div');div.innerText=name||obj.options.type;div.classList.add('jupload-item');div.setAttribute('tabindex',-1);el.appendChild(div);}
if(data.content){data.file=jSuites.guid();}
el.content.push(data);if(typeof(obj.options.onchange)=='function'){obj.options.onchange(el,data);}}
obj.addFromFile=function(file){var type=file.type.split('/');if(type[0]==obj.options.type){var readFile=new FileReader();readFile.addEventListener("load",function(v){var data={file:v.srcElement.result,extension:file.name.substr(file.name.lastIndexOf('.')+1),name:file.name,size:file.size,lastmodified:file.lastModified,content:v.srcElement.result,}
obj.add(data);});readFile.readAsDataURL(file);}else{alert(obj.options.text.extensionNotAllowed);}}
obj.addFromUrl=function(src){if(src.substr(0,4)!='data'&&!obj.options.remoteParser){console.error('remoteParser not defined in your initialization');}else{if(src.substr(0,4)=='data'){var extension=src.split(';')
extension=extension[0].split('/');var type=extension[0].replace('data:','');if(type==obj.options.type){var data={file:src,name:'',extension:extension[1],content:src,}
obj.add(data);}else{alert(obj.options.text.extensionNotAllowed);}}else{var extension=src.substr(src.lastIndexOf('.')+1);src=obj.options.remoteParser+src;jSuites.ajax({url:src,type:'GET',dataType:'blob',success:function(data){}})}}}
var getDataURL=function(canvas,type){var compression=0.92;var lastContentLength=null;var content=canvas.toDataURL(type,compression);while(obj.options.maxJpegSizeBytes&&type==='image/jpeg'&&content.length>obj.options.maxJpegSizeBytes&&content.length!==lastContentLength){compression*=0.9;lastContentLength=content.length;content=canvas.toDataURL(type,compression);}
return content;}
var mime=obj.options.type+'/'+obj.options.extension;var input=document.createElement('input');input.type='file';input.setAttribute('accept',mime);input.onchange=function(){for(var i=0;i<this.files.length;i++){obj.addFromFile(this.files[i]);}}
if(obj.options.multiple==true){input.setAttribute('multiple',true);}
var current=null;el.addEventListener("click",function(e){current=null;if(!el.children.length||e.target===el){jSuites.click(input);}else{if(e.target.parentNode==el){current=e.target;}}});el.addEventListener("dblclick",function(e){jSuites.click(input);});el.addEventListener('dragenter',function(e){el.style.border='1px dashed #000';});el.addEventListener('dragleave',function(e){el.style.border='1px solid #eee';});el.addEventListener('dragstop',function(e){el.style.border='1px solid #eee';});el.addEventListener('dragover',function(e){e.preventDefault();});el.addEventListener('keydown',function(e){if(current&&e.which==46){var index=Array.prototype.indexOf.call(el.children,current);if(index>=0){el.content.splice(index,1);current.remove();current=null;}}});el.addEventListener('drop',function(e){e.preventDefault();e.stopPropagation();var html=(e.originalEvent||e).dataTransfer.getData('text/html');var file=(e.originalEvent||e).dataTransfer.files;if(file.length){for(var i=0;i<e.dataTransfer.files.length;i++){obj.addFromFile(e.dataTransfer.files[i]);}}else if(html){if(obj.options.multiple==false){el.innerText='';}
var div=document.createElement('div');div.innerHTML=html;var img=div.querySelectorAll('img');if(img.length){for(var i=0;i<img.length;i++){obj.addFromUrl(img[i].src);}}}
el.style.border='1px solid #eee';return false;});el.val=function(val){if(val===undefined){return el.content&&el.content.length?el.content:null;}else{el.innerText='';el.content=[];if(val){if(Array.isArray(val)){for(var i=0;i<val.length;i++){if(typeof(val[i])=='string'){obj.add({file:val[i]});}else{obj.add(val[i]);}}}else if(typeof(val)=='string'){obj.add({file:val});}}}}
el.upload=el.image=obj;return obj;});jSuites.image.create=function(data){var img=document.createElement('img');img.setAttribute('src',data.file);img.className='jfile';img.setAttribute('tabindex',-1);img.content=data;return img;}
jSuites.lazyLoading=(function(el,options){var obj={}
if(!options.loadUp||typeof(options.loadUp)!='function'){options.loadUp=function(){return false;}}
if(!options.loadDown||typeof(options.loadDown)!='function'){options.loadDown=function(){return false;}}
if(!options.timer){options.timer=100;}
var timeControlLoading=null;var scrollControls=function(e){if(timeControlLoading==null){var event=false;var scrollTop=el.scrollTop;if(el.scrollTop+(el.clientHeight*2)>=el.scrollHeight){if(options.loadDown()){if(scrollTop==el.scrollTop){el.scrollTop=el.scrollTop-(el.clientHeight);}
event=true;}}else if(el.scrollTop<=el.clientHeight){if(options.loadUp()){if(scrollTop==el.scrollTop){el.scrollTop=el.scrollTop+(el.clientHeight);}
event=true;}}
timeControlLoading=setTimeout(function(){timeControlLoading=null;},options.timer);if(event){if(typeof(options.onupdate)=='function'){options.onupdate();}}}}
el.onscroll=function(e){scrollControls(e);}
el.onwheel=function(e){scrollControls(e);}
return obj;});jSuites.loading=(function(){var obj={};var loading=null;obj.show=function(){if(!loading){loading=document.createElement('div');loading.className='jloading';}
document.body.appendChild(loading);}
obj.hide=function(){if(loading&&loading.parentNode){document.body.removeChild(loading);}}
return obj;})();jSuites.mask=(function(){var tokens={currency:['#(.{1})##0?(.{1}0+)?( ?;(.*)?)?','#'],percentage:['0{1}(.{1}0+)?%'],numeric:['0{1}(.{1}0+)?'],datetime:['YYYY','YYY','YY','MMMMM','MMMM','MMM','MM','DDDDD','DDDD','DDD','DD','DY','DAY','WD','D','Q','HH24','HH12','HH','\\[H\\]','H','AM/PM','PM','AM','MI','SS','MS','MONTH','MON','Y','M'],general:['A','0','[0-9a-zA-Z\$]+','.']}
var getDate=function(){if(this.mask.toLowerCase().indexOf('[h]')!==-1){var m=0;if(this.date[4]){m=parseFloat(this.date[4]/60);}
var v=parseInt(this.date[3])+m;v/=24;}else if(!(this.date[0]&&this.date[1]&&this.date[2])&&(this.date[3]||this.date[4])){v=jSuites.two(this.date[3])+':'+jSuites.two(this.date[4])+':'+jSuites.two(this.date[5])}else{if(this.date[0]&&this.date[1]&&!this.date[2]){this.date[2]=1;}
v=jSuites.two(this.date[0])+'-'+jSuites.two(this.date[1])+'-'+jSuites.two(this.date[2]);if(this.date[3]||this.date[4]||this.date[5]){v+=' '+jSuites.two(this.date[3])+':'+jSuites.two(this.date[4])+':'+jSuites.two(this.date[5]);}}
return v;}
var isBlank=function(v){return v===null||v===''||v===undefined?true:false;}
var isFormula=function(value){return(''+value).chartAt(0)=='=';}
var isNumeric=function(t){return t==='currency'||t==='percentage'||t==='numeric'?true:false;}
var getDecimal=function(v){if(v&&Number(v)==v){return '.';}else{if(this.options.decimal){return this.options.decimal;}else{if(this.locale){var t=Intl.NumberFormat(this.locale).format(1.1);return this.options.decimal=t[1];}else{if(!v){v=this.mask;}
var e=new RegExp('0{1}(.{1})0+','ig');var t=e.exec(v);if(t&&t[1]&&t[1].length==1){this.options.decimal=t[1];return t[1];}else{var e=new RegExp('#{1}(.{1})#+','ig');var t=e.exec(v);if(t&&t[1]&&t[1].length==1){if(t[1]===','){this.options.decimal='.';}else{this.options.decimal=',';}}else{this.options.decimal='1.1'.toLocaleString().substring(1,2);}}}}}
if(this.options.decimal){return this.options.decimal;}else{return null;}}
var ParseValue=function(v,decimal){if(v==''){return '';}
if(!decimal){decimal=getDecimal.call(this);}
v=(''+v).split(decimal);v[0]=v[0].match(/[\-0-9]+/g,'');if(v[0]){v[0]=v[0].join('');}
if(v[0]||v[1]){if(v[1]!==undefined){v[1]=v[1].match(/[0-9]+/g,'');if(v[1]){v[1]=v[1].join('');}else{v[1]='';}}}else{return '';}
return v;}
var FormatValue=function(v){if(v==''){return '';}
var d=getDecimal.call(this);var o=this.options;v=ParseValue.call(this,v);if(v==''){return '';}
if(v[0]==='-'){v[0]='-0';}
if(v[0]){var t=parseFloat(v[0]+'.1');if(o.style=='percent'){t/=100;}}else{var t=null;}
var n=new Intl.NumberFormat(this.locale,o).format(t);n=n.split(d);if(typeof(n[1])!=='undefined'){var s=n[1].replace(/[0-9]*/g,'');if(s){n[2]=s;}}
if(v[1]!==undefined){n[1]=d+v[1];}else{n[1]='';}
return n.join('');}
var Format=function(e){var v=Value.call(e);if(!v){return;}
var d=getDecimal.call(this);var n=FormatValue.call(this,v);var t=(n.length)-v.length;var index=Caret.call(e)+t;Value.call(e,n,index,true);}
var Extract=function(v){var current=ParseValue.call(this,v);if(current){if(current[0]==='-'){current[0]='-0';}
return parseFloat(current.join('.'));}
return null;}
var Caret=function(index,adjustNumeric){if(index===undefined){if(this.tagName=='DIV'){var pos=0;var s=window.getSelection();if(s){if(s.rangeCount!==0){var r=s.getRangeAt(0);var p=r.cloneRange();p.selectNodeContents(this);p.setEnd(r.endContainer,r.endOffset);pos=p.toString().length;}}
return pos;}else{return this.selectionStart;}}else{var n=Value.call(this);if(adjustNumeric){var p=null;for(var i=0;i<n.length;i++){if(n[i].match(/[\-0-9]/g)||n[i]=='.'||n[i]==','){p=i;}}
if(p===null){p=n.indexOf(' ');}
if(index>=p){index=p+1;}}
if(index>n.length){index=n.length;}
if(index){if(this.tagName=='DIV'){var s=window.getSelection();var r=document.createRange();if(this.childNodes[0]){r.setStart(this.childNodes[0],index);s.removeAllRanges();s.addRange(r);}}else{this.selectionStart=index;this.selectionEnd=index;}}}}
var Value=function(v,updateCaret,adjustNumeric){if(this.tagName=='DIV'){if(v===undefined){return this.innerText;}else{if(this.innerText!==v){this.innerText=v;if(updateCaret){Caret.call(this,updateCaret,adjustNumeric);}}}}else{if(v===undefined){return this.value;}else{if(this.value!==v){this.value=v;if(updateCaret){Caret.call(this,updateCaret,adjustNumeric);}}}}}
var weekDaysFull=jSuites.calendar.weekdays;var weekDays=jSuites.calendar.weekdaysShort;var monthsFull=jSuites.calendar.months;var months=jSuites.calendar.monthsShort;var parser={'YEAR':function(v,s){var y=''+new Date().getFullYear();if(typeof(this.values[this.index])==='undefined'){this.values[this.index]='';}
if(parseInt(v)>=0&&parseInt(v)<=10){if(this.values[this.index].length<s){this.values[this.index]+=v;}}
if(this.values[this.index].length==s){if(s==2){var y=y.substr(0,2)+this.values[this.index];}else if(s==3){var y=y.substr(0,1)+this.values[this.index];}else if(s==4){var y=this.values[this.index];}
this.date[0]=y;this.index++;}},'YYYY':function(v){parser.YEAR.call(this,v,4);},'YYY':function(v){parser.YEAR.call(this,v,3);},'YY':function(v){parser.YEAR.call(this,v,2);},'FIND':function(v,a){if(isBlank(this.values[this.index])){this.values[this.index]='';}
var pos=0;var count=0;var value=(this.values[this.index]+v).toLowerCase();for(var i=0;i<a.length;i++){if(a[i].toLowerCase().indexOf(value)==0){pos=i;count++;}}
if(count>1){this.values[this.index]+=v;}else if(count==1){var t=(a[pos].length-this.values[this.index].length)-1;this.position+=t;this.values[this.index]=a[pos];this.index++;return pos;}},'MMM':function(v){var ret=parser.FIND.call(this,v,months);if(ret!==undefined){this.date[1]=ret+1;}},'MMMM':function(v){var ret=parser.FIND.call(this,v,monthsFull);if(ret!==undefined){this.date[1]=ret+1;}},'MMMMM':function(v){if(isBlank(this.values[this.index])){this.values[this.index]='';}
var pos=0;var count=0;var value=(this.values[this.index]+v).toLowerCase();for(var i=0;i<monthsFull.length;i++){if(monthsFull[i][0].toLowerCase().indexOf(value)==0){this.values[this.index]=monthsFull[i][0];this.date[1]=i+1;this.index++;break;}}},'MM':function(v){if(isBlank(this.values[this.index])){if(parseInt(v)>1&&parseInt(v)<10){this.date[1]=this.values[this.index]='0'+v;this.index++;}else if(parseInt(v)<2){this.values[this.index]=v;}}else{if(this.values[this.index]==1&&parseInt(v)<3){this.date[1]=this.values[this.index]+=v;this.index++;}else if(this.values[this.index]==0&&parseInt(v)>0&&parseInt(v)<10){this.date[1]=this.values[this.index]+=v;this.index++;}}},'M':function(v){var test=false;if(parseInt(v)>=0&&parseInt(v)<10){if(isBlank(this.values[this.index])){this.values[this.index]=v;if(v>1){this.date[1]=this.values[this.index];this.index++;}}else{if(this.values[this.index]==1&&parseInt(v)<3){this.date[1]=this.values[this.index]+=v;this.index++;}else if(this.values[this.index]==0&&parseInt(v)>0){this.date[1]=this.values[this.index]+=v;this.index++;}else{var test=true;}}}else{var test=true;}
if(test==true){var t=parseInt(this.values[this.index]);if(t>0&&t<12){this.date[2]=this.values[this.index];this.index++;this.position--;}}},'D':function(v){var test=false;if(parseInt(v)>=0&&parseInt(v)<10){if(isBlank(this.values[this.index])){this.values[this.index]=v;if(parseInt(v)>3){this.date[2]=this.values[this.index];this.index++;}}else{if(this.values[this.index]==3&&parseInt(v)<2){this.date[2]=this.values[this.index]+=v;this.index++;}else if(this.values[this.index]==1||this.values[this.index]==2){this.date[2]=this.values[this.index]+=v;this.index++;}else if(this.values[this.index]==0&&parseInt(v)>0){this.date[2]=this.values[this.index]+=v;this.index++;}else{var test=true;}}}else{var test=true;}
if(test==true){var t=parseInt(this.values[this.index]);if(t>0&&t<32){this.date[2]=this.values[this.index];this.index++;this.position--;}}},'DD':function(v){if(isBlank(this.values[this.index])){if(parseInt(v)>3&&parseInt(v)<10){this.date[2]=this.values[this.index]='0'+v;this.index++;}else if(parseInt(v)<10){this.values[this.index]=v;}}else{if(this.values[this.index]==3&&parseInt(v)<2){this.date[2]=this.values[this.index]+=v;this.index++;}else if((this.values[this.index]==1||this.values[this.index]==2)&&parseInt(v)<10){this.date[2]=this.values[this.index]+=v;this.index++;}else if(this.values[this.index]==0&&parseInt(v)>0&&parseInt(v)<10){this.date[2]=this.values[this.index]+=v;this.index++;}}},'DDD':function(v){parser.FIND.call(this,v,weekDays);},'DDDD':function(v){parser.FIND.call(this,v,weekDaysFull);},'HH12':function(v,two){if(isBlank(this.values[this.index])){if(parseInt(v)>1&&parseInt(v)<10){if(two){v=0+v;}
this.date[3]=this.values[this.index]=v;this.index++;}else if(parseInt(v)<10){this.values[this.index]=v;}}else{if(this.values[this.index]==1&&parseInt(v)<3){this.date[3]=this.values[this.index]+=v;this.index++;}else if(this.values[this.index]<1&&parseInt(v)<10){this.date[3]=this.values[this.index]+=v;this.index++;}}},'HH24':function(v,two){var test=false;if(parseInt(v)>=0&&parseInt(v)<10){if(this.values[this.index]==null||this.values[this.index]==''){if(parseInt(v)>2&&parseInt(v)<10){if(two){v=0+v;}
this.date[3]=this.values[this.index]=v;this.index++;}else if(parseInt(v)<10){this.values[this.index]=v;}}else{if(this.values[this.index]==2&&parseInt(v)<4){this.date[3]=this.values[this.index]+=v;this.index++;}else if(this.values[this.index]<2&&parseInt(v)<10){this.date[3]=this.values[this.index]+=v;this.index++;}}}},'HH':function(v){parser['HH24'].call(this,v,1);},'H':function(v){parser['HH24'].call(this,v,0);},'\\[H\\]':function(v){if(this.values[this.index]==undefined){this.values[this.index]='';}
if(v.match(/[0-9]/g)){this.date[3]=this.values[this.index]+=v;}else{if(this.values[this.index].match(/[0-9]/g)){this.date[3]=this.values[this.index];this.index++;this.position--;}}},'N60':function(v,i){if(this.values[this.index]==null||this.values[this.index]==''){if(parseInt(v)>5&&parseInt(v)<10){this.date[i]=this.values[this.index]='0'+v;this.index++;}else if(parseInt(v)<10){this.values[this.index]=v;}}else{if(parseInt(v)<10){this.date[i]=this.values[this.index]+=v;this.index++;}}},'MI':function(v){parser.N60.call(this,v,4);},'SS':function(v){parser.N60.call(this,v,5);},'AM/PM':function(v){this.values[this.index]='';if(v){if(this.date[3]>12){this.values[this.index]='PM';}else{this.values[this.index]='AM';}}
this.index++;},'WD':function(v){if(typeof(this.values[this.index])==='undefined'){this.values[this.index]='';}
if(parseInt(v)>=0&&parseInt(v)<7){this.values[this.index]=v;}
if(this.value[this.index].length==1){this.index++;}},'0{1}(.{1}0+)?':function(v){var decimal=getDecimal.call(this);var neg=false;if(isBlank(this.values[this.index])){this.values[this.index]='';}else{if(this.values[this.index]=='-'){neg=true;}}
var current=ParseValue.call(this,this.values[this.index],decimal);if(current){this.values[this.index]=current.join(decimal);}
if(parseInt(v)>=0&&parseInt(v)<10){if(this.values[this.index]=='0'&&v>0){this.values[this.index]='';}else if(this.values[this.index]=='-0'&&v>0){this.values[this.index]='-';}
if((this.values[this.index]!='0'&&this.values[this.index]!='-0')||v==decimal){this.values[this.index]+=v;}}else if(decimal&&v==decimal){if(this.values[this.index].indexOf(decimal)==-1){if(!this.values[this.index]){this.values[this.index]='0';}
this.values[this.index]+=v;}}else if(v=='-'){neg=true;}
if(neg===true&&this.values[this.index][0]!=='-'){this.values[this.index]='-'+this.values[this.index];}},'0{1}(.{1}0+)?%':function(v){parser['0{1}(.{1}0+)?'].call(this,v);if(this.values[this.index].match(/[\-0-9]/g)){if(this.values[this.index]&&this.values[this.index].indexOf('%')==-1){this.values[this.index]+='%';}}else{this.values[this.index]='';}},'#(.{1})##0?(.{1}0+)?( ?;(.*)?)?':function(v){parser['0{1}(.{1}0+)?'].call(this,v);var decimal=getDecimal.call(this);var separator=this.tokens[this.index].substr(1,1);var negative=this.values[this.index][0]==='-'?true:false;var current=ParseValue.call(this,this.values[this.index],decimal);if(current!==''){var n=current[0].match(/[0-9]/g);if(n){n=n.join('');var t=[];var s=0;for(var j=n.length-1;j>=0;j--){t.push(n[j]);s++;if(!(s%3)){t.push(separator);}}
t=t.reverse();current[0]=t.join('');if(current[0].substr(0,1)==separator){current[0]=current[0].substr(1);}}else{current[0]='';}
this.values[this.index]=current.join(decimal);if(negative){this.values[this.index]='-'+this.values[this.index];}}},'0':function(v){if(v.match(/[0-9]/g)){this.values[this.index]=v;this.index++;}},'[0-9a-zA-Z$]+':function(v){if(isBlank(this.values[this.index])){this.values[this.index]='';}
var t=this.tokens[this.index];var s=this.values[this.index];var i=s.length;if(t[i]==v){this.values[this.index]+=v;if(this.values[this.index]==t){this.index++;}}else{this.values[this.index]=t;this.index++;if(v.match(/[\-0-9]/g)){this.position--;}}},'A':function(v){if(v.match(/[a-zA-Z]/gi)){this.values[this.index]=v;this.index++;}},'.':function(v){parser['[0-9a-zA-Z$]+'].call(this,v);}}
var getTokens=function(str){if(this.type=='general'){var t=[].concat(tokens.general);}else{var t=[].concat(tokens.currency,tokens.datetime,tokens.percentage,tokens.numeric,tokens.general);}
var e=new RegExp(t.join('|'),'gi');return str.match(e);}
var getMethod=function(str){if(!this.type){var types=Object.keys(tokens);}else if(this.type=='general'){var types=['general'];}else if(this.type=='datetime'){var types=['numeric','datetime','general'];}else{var types=['currency','percentage','numeric','general'];}
for(var i=0;i<types.length;i++){var type=types[i];for(var j=0;j<tokens[type].length;j++){var e=new RegExp(tokens[type][j],'gi');var r=str.match(e);if(r){return{type:type,method:tokens[type][j]}}}}}
var getMethods=function(t){var result=[];for(var i=0;i<t.length;i++){var m=getMethod.call(this,t[i]);if(m){result.push(m.method);}else{result.push(null);}}
for(var i=0;i<result.length;i++){if(result[i]=='MM'){if(result[i-1]&&result[i-1].indexOf('H')>=0){result[i]='MI';}else if(result[i-2]&&result[i-2].indexOf('H')>=0){result[i]='MI';}else if(result[i+1]&&result[i+1].indexOf('S')>=0){result[i]='MI';}else if(result[i+2]&&result[i+2].indexOf('S')>=0){result[i]='MI';}}}
return result;}
var getType=function(str){var m=getMethod.call(this,str);if(m){var type=m.type;}
if(type){var numeric=0;var t=getTokens.call(this,str);for(var i=0;i<t.length;i++){m=getMethod.call(this,t[i]);if(m&&isNumeric(m.type)){numeric++;}}
if(numeric>1){type='general';}}
return type;}
var parse=function(){if(typeof(parser[this.methods[this.index]])=='function'){parser[this.methods[this.index]].call(this,this.value[this.position]);this.position++;}else{this.values[this.index]=this.tokens[this.index];this.index++;}}
var isFormula=function(value){var v=(''+value)[0];return v=='='?true:false;}
var toPlainString=function(num){return(''+ +num).replace(/(-?)(\d*)\.?(\d*)e([+-]\d+)/,function(a,b,c,d,e){return e<0?b+'0.'+Array(1-e-c.length).join(0)+c+d:b+c+d+Array(e-d.length+1).join(0);});}
var obj=function(e,config,returnObject){var r=null;var t=null;var o={input:null,value:null,options:{},values:[],index:0,position:0,date:[0,0,0,0,0,0],number:0,}
if(typeof(e)=='object'){o.input=e.target;o.value=Value.call(e.target);o.caret=Caret.call(e.target);if(t=e.target.getAttribute('data-mask')){o.mask=t;}
if(t=e.target.getAttribute('data-type')){o.type=t;}
if(e.target.mask){if(e.target.mask.options){o.options=e.target.mask.options;}
if(e.target.mask.locale){o.locale=e.target.mask.locale;}}else{if(t=e.target.getAttribute('data-locale')){o.locale=t;if(o.mask){o.options.style=o.mask;}}}
if(e.target.attributes&&e.target.attributes.length){for(var i=0;i<e.target.attributes.length;i++){var k=e.target.attributes[i].name;var v=e.target.attributes[i].value;if(k.substr(0,4)=='data'){o.options[k.substr(5)]=v;}}}}else{if(typeof(config)=='string'){o.mask=config;}else{var k=Object.keys(config);for(var i=0;i<k.length;i++){o[k[i]]=config[k[i]];}}
if(typeof(e)==='number'){getDecimal.call(o,o.mask);e=(''+e).replace('.',o.options.decimal);}
o.value=e;if(o.input){Value.call(o.input,e);jSuites.focus(o.input);o.caret=Caret.call(o.input);}}
if(!isFormula(o.value)&&(o.mask||o.locale)){if(o.mask){o.mask=o.mask.replace('[-]','');if(o.mask.indexOf('##')!==-1){var d=o.mask.split(';');if(d[0]){d[0]=d[0].replace('*','');d[0]=d[0].replace(/_/g,'');d[0]=d[0].replace(/-/g,'');d[0]=d[0].replace('(','');d[0]=d[0].replace(')','');d[0]=d[0].replace('##0.###','##0.000');d[0]=d[0].replace('##0.##','##0.00');d[0]=d[0].replace('##0.#','##0.0');}
o.mask=d[0];}
if(!o.type){o.type=getType.call(o,o.mask);}
o.tokens=getTokens.call(o,o.mask);}
if(typeof(e)!=='object'||!e.inputType||!e.inputType.indexOf('insert')||!e.inputType.indexOf('delete')){if(o.locale){if(o.input){Format.call(o,o.input);}else{var newValue=FormatValue.call(o,o.value);}}else{o.methods=getMethods.call(o,o.tokens);while(o.position<o.value.length&&typeof(o.tokens[o.index])!=='undefined'){parse.call(o);}
if(isNumeric(o.type)){while(typeof(o.tokens[o.index])!=='undefined'){var t=getMethod.call(o,o.tokens[o.index]);if(t&&t.type=='general'){o.values[o.index]=o.tokens[o.index];}
o.index++;}
var adjustNumeric=true;}else{var adjustNumeric=false;}
var newValue=o.values.join('');if(o.input){t=newValue.length-o.value.length;if(t>0){var caret=o.caret+t;}else{var caret=o.caret;}
Value.call(o.input,newValue,caret,adjustNumeric);}}}
if(o.input){var label=null;if(isNumeric(o.type)){o.number=Extract.call(o,Value.call(o.input));if(o.type=='percentage'){label=o.number/100;}else{label=o.number;}}else if(o.type=='datetime'){label=getDate.call(o);if(o.date[0]&&o.date[1]&&o.date[2]){o.input.setAttribute('data-completed',true);}}
if(label){o.input.setAttribute('data-value',label);}}
if(newValue!==undefined){if(returnObject){return o;}else{return newValue;}}}}
obj.prepare=function(str,o){if(!o){o={};}
return getTokens.call(o,str);}
obj.apply=function(e){var v=Value.call(e.target);if(e.key.length==1){v+=e.key;}
Value.call(e.target,obj(v,e.target.getAttribute('data-mask')));}
obj.run=function(value,mask,decimal){return obj(value,{mask:mask,decimal:decimal});}
obj.extract=function(v,options,returnObject){if(isBlank(v)){return v;}
if(typeof(options)!='object'){return value;}else{if(!options.options){options.options={};}}
if(!options.mask&&options.format){options.mask=options.format;}
getDecimal.call(options,options.mask);var type=null;if(options.type=='percent'||options.options.style=='percent'){type='percentage';}else if(options.mask){type=getType.call(options,options.mask);}
if(type==='general'){var o=obj(v,options,true);value=v;}else if(type==='datetime'){if(v instanceof Date){var t=jSuites.calendar.getDateString(value,options.mask);}
var o=obj(v,options,true);if(jSuites.isNumeric(v)){value=v;}else{var value=getDate.call(o);var t=jSuites.calendar.now(o.date);value=jSuites.calendar.dateToNum(t);}}else{var value=Extract.call(options,v);if(type=='percentage'){value/=100;}
var o=options;}
o.value=value;if(!o.type&&type){o.type=type;}
if(returnObject){return o;}else{return value;}}
obj.render=function(value,options,fullMask){if(isBlank(value)){return value;}
if(typeof(options)!='object'){return value;}else{if(!options.options){options.options={};}}
if(!options.mask&&options.format){options.mask=options.format;}
var type=null;if(options.type=='percent'||options.options.style=='percent'){type='percentage';}else if(options.mask){type=getType.call(options,options.mask);}else if(value instanceof Date){type='datetime';}
var fillWithBlanks=false;if(type=='datetime'||options.type=='calendar'){var t=jSuites.calendar.getDateString(value,options.mask);if(t){value=t;}
if(options.mask&&fullMask){fillWithBlanks=true;}}else{if(type=='percentage'){value*=100;}
if(typeof(value)==='number'){var t=null;if(options.mask&&fullMask){var e=new RegExp('0{1}(.{1})0+','ig');var d=options.mask.match(e);if(d&&d[0]){d=d[0].length-2;t=value.toFixed(d);}else{t=value.toFixed(0);}}else if(options.locale&&fullMask){var d=(''+value).split('.');if(options.options){if(typeof(d[1])==='undefined'){d[1]='';}
var len=d[1].length;if(options.options.minimumFractionDigits>len){for(var i=0;i<options.options.minimumFractionDigits-len;i++){d[1]+='0';}}}
if(!d[1].length){t=d[0]}else{t=d.join('.');}
var len=d[1].length;if(options.options&&options.options.maximumFractionDigits<len){t=parseFloat(t).toFixed(options.options.maximumFractionDigits);}}else{t=toPlainString(value);}
if(t!==null){value=t;getDecimal.call(options,options.mask);if(options.options.decimal){value=value.replace('.',options.options.decimal);}}}else{if(options.mask&&fullMask){fillWithBlanks=true;}}}
if(fillWithBlanks){var s=options.mask.length-value.length;if(s>0){for(var i=0;i<s;i++){value+=' ';}}}
value=obj(value,options);return value;}
obj.set=function(e,m){if(m){e.setAttribute('data-mask',m);var event=new Event('input',{bubbles:true,cancelable:true,});e.dispatchEvent(event);}}
if(typeof document!=='undefined'){document.addEventListener('input',function(e){if(e.target.getAttribute('data-mask')||e.target.mask){obj(e);}});}
return obj;})();jSuites.modal=(function(el,options){var obj={};obj.options={};var defaults={url:null,onopen:null,onclose:null,closed:false,width:null,height:null,title:null,padding:null,backdrop:true,};for(var property in defaults){if(options&&options.hasOwnProperty(property)){obj.options[property]=options[property];}else{obj.options[property]=defaults[property];}}
if(!obj.options.title&&el.getAttribute('title')){obj.options.title=el.getAttribute('title');}
var temp=document.createElement('div');while(el.children[0]){temp.appendChild(el.children[0]);}
obj.content=document.createElement('div');obj.content.className='jmodal_content';obj.content.innerHTML=el.innerHTML;while(temp.children[0]){obj.content.appendChild(temp.children[0]);}
obj.container=document.createElement('div');obj.container.className='jmodal';obj.container.appendChild(obj.content);if(obj.options.padding){obj.content.style.padding=obj.options.padding;}
if(obj.options.width){obj.container.style.width=obj.options.width;}
if(obj.options.height){obj.container.style.height=obj.options.height;}
if(obj.options.title){obj.container.setAttribute('title',obj.options.title);}else{obj.container.classList.add('no-title');}
el.innerHTML='';el.style.display='none';el.appendChild(obj.container);if(obj.options.backdrop){var backdrop=document.createElement('div');backdrop.className='jmodal_backdrop';backdrop.onclick=function(){obj.close();}
el.appendChild(backdrop);}
obj.open=function(){el.style.display='block';var rect=obj.container.getBoundingClientRect();if(jSuites.getWindowWidth()<rect.width){obj.container.style.top='';obj.container.style.left='';obj.container.classList.add('jmodal_fullscreen');jSuites.animation.slideBottom(obj.container,1);}else{if(obj.options.backdrop){backdrop.style.display='block';}}
if(typeof(obj.options.onopen)=='function'){obj.options.onopen(el,obj);}}
obj.resetPosition=function(){obj.container.style.top='';obj.container.style.left='';}
obj.isOpen=function(){return el.style.display!='none'?true:false;}
obj.close=function(){if(obj.isOpen()){el.style.display='none';if(obj.options.backdrop){backdrop.style.display='';}
obj.container.classList.remove('jmodal_fullscreen');if(typeof(obj.options.onclose)=='function'){obj.options.onclose(el,obj);}}}
if(!jSuites.modal.hasEvents){var tracker=null;document.addEventListener('keydown',function(e){if(e.which==27){var modals=document.querySelectorAll('.jmodal');for(var i=0;i<modals.length;i++){modals[i].parentNode.modal.close();}}});document.addEventListener('mouseup',function(e){var item=jSuites.findElement(e.target,'jmodal');if(item){var rect=item.getBoundingClientRect();if(e.changedTouches&&e.changedTouches[0]){var x=e.changedTouches[0].clientX;var y=e.changedTouches[0].clientY;}else{var x=e.clientX;var y=e.clientY;}
if(rect.width-(x-rect.left)<50&&(y-rect.top)<50){item.parentNode.modal.close();}}
if(tracker){tracker.element.style.cursor='auto';tracker=null;}});document.addEventListener('mousedown',function(e){var item=jSuites.findElement(e.target,'jmodal');if(item){var rect=item.getBoundingClientRect();if(e.changedTouches&&e.changedTouches[0]){var x=e.changedTouches[0].clientX;var y=e.changedTouches[0].clientY;}else{var x=e.clientX;var y=e.clientY;}
if(rect.width-(x-rect.left)<50&&(y-rect.top)<50){}else{if(e.target.getAttribute('title')&&(y-rect.top)<50){if(document.selection){document.selection.empty();}else if(window.getSelection){window.getSelection().removeAllRanges();}
tracker={left:rect.left,top:rect.top,x:e.clientX,y:e.clientY,width:rect.width,height:rect.height,element:item,}}}}});document.addEventListener('mousemove',function(e){if(tracker){e=e||window.event;if(e.buttons){var mouseButton=e.buttons;}else if(e.button){var mouseButton=e.button;}else{var mouseButton=e.which;}
if(mouseButton){tracker.element.style.top=(tracker.top+(e.clientY-tracker.y)+(tracker.height/2))+'px';tracker.element.style.left=(tracker.left+(e.clientX-tracker.x)+(tracker.width/2))+'px';tracker.element.style.cursor='move';}else{tracker.element.style.cursor='auto';}}});jSuites.modal.hasEvents=true;}
if(obj.options.url){jSuites.ajax({url:obj.options.url,method:'GET',dataType:'text/html',success:function(data){obj.content.innerHTML=data;if(!obj.options.closed){obj.open();}}});}else{if(!obj.options.closed){obj.open();}}
el.modal=obj;return obj;});jSuites.notification=(function(options){var obj={};obj.options={};var defaults={icon:null,name:'Notification',date:null,error:null,title:null,message:null,timeout:4000,autoHide:true,closeable:true,};for(var property in defaults){if(options&&options.hasOwnProperty(property)){obj.options[property]=options[property];}else{obj.options[property]=defaults[property];}}
var notification=document.createElement('div');notification.className='jnotification';if(obj.options.error){notification.classList.add('jnotification-error');}
var notificationContainer=document.createElement('div');notificationContainer.className='jnotification-container';notification.appendChild(notificationContainer);var notificationHeader=document.createElement('div');notificationHeader.className='jnotification-header';notificationContainer.appendChild(notificationHeader);var notificationImage=document.createElement('div');notificationImage.className='jnotification-image';notificationHeader.appendChild(notificationImage);if(obj.options.icon){var notificationIcon=document.createElement('img');notificationIcon.src=obj.options.icon;notificationImage.appendChild(notificationIcon);}
var notificationName=document.createElement('div');notificationName.className='jnotification-name';notificationName.innerHTML=obj.options.name;notificationHeader.appendChild(notificationName);if(obj.options.closeable==true){var notificationClose=document.createElement('div');notificationClose.className='jnotification-close';notificationClose.onclick=function(){obj.hide();}
notificationHeader.appendChild(notificationClose);}
var notificationDate=document.createElement('div');notificationDate.className='jnotification-date';notificationHeader.appendChild(notificationDate);var notificationContent=document.createElement('div');notificationContent.className='jnotification-content';notificationContainer.appendChild(notificationContent);if(obj.options.title){var notificationTitle=document.createElement('div');notificationTitle.className='jnotification-title';notificationTitle.innerHTML=obj.options.title;notificationContent.appendChild(notificationTitle);}
var notificationMessage=document.createElement('div');notificationMessage.className='jnotification-message';notificationMessage.innerHTML=obj.options.message;notificationContent.appendChild(notificationMessage);obj.show=function(){document.body.appendChild(notification);if(jSuites.getWindowWidth()>800){jSuites.animation.fadeIn(notification);}else{jSuites.animation.slideTop(notification,1);}}
obj.hide=function(){if(jSuites.getWindowWidth()>800){jSuites.animation.fadeOut(notification,function(){if(notification.parentNode){notification.parentNode.removeChild(notification);if(notificationTimeout){clearTimeout(notificationTimeout);}}});}else{jSuites.animation.slideTop(notification,0,function(){if(notification.parentNode){notification.parentNode.removeChild(notification);if(notificationTimeout){clearTimeout(notificationTimeout);}}});}};obj.show();if(obj.options.autoHide==true){var notificationTimeout=setTimeout(function(){obj.hide();},obj.options.timeout);}
if(jSuites.getWindowWidth()<800){notification.addEventListener("swipeup",function(e){obj.hide();e.preventDefault();e.stopPropagation();});}
return obj;});jSuites.notification.isVisible=function(){var j=document.querySelector('.jnotification');return j&&j.parentNode?true:false;}
jSuites.palette=(function(){var palette={material:[["#ffebee","#fce4ec","#f3e5f5","#e8eaf6","#e3f2fd","#e0f7fa","#e0f2f1","#e8f5e9","#f1f8e9","#f9fbe7","#fffde7","#fff8e1","#fff3e0","#fbe9e7","#efebe9","#fafafa","#eceff1"],["#ffcdd2","#f8bbd0","#e1bee7","#c5cae9","#bbdefb","#b2ebf2","#b2dfdb","#c8e6c9","#dcedc8","#f0f4c3","#fff9c4","#ffecb3","#ffe0b2","#ffccbc","#d7ccc8","#f5f5f5","#cfd8dc"],["#ef9a9a","#f48fb1","#ce93d8","#9fa8da","#90caf9","#80deea","#80cbc4","#a5d6a7","#c5e1a5","#e6ee9c","#fff59d","#ffe082","#ffcc80","#ffab91","#bcaaa4","#eeeeee","#b0bec5"],["#e57373","#f06292","#ba68c8","#7986cb","#64b5f6","#4dd0e1","#4db6ac","#81c784","#aed581","#dce775","#fff176","#ffd54f","#ffb74d","#ff8a65","#a1887f","#e0e0e0","#90a4ae"],["#ef5350","#ec407a","#ab47bc","#5c6bc0","#42a5f5","#26c6da","#26a69a","#66bb6a","#9ccc65","#d4e157","#ffee58","#ffca28","#ffa726","#ff7043","#8d6e63","#bdbdbd","#78909c"],["#f44336","#e91e63","#9c27b0","#3f51b5","#2196f3","#00bcd4","#009688","#4caf50","#8bc34a","#cddc39","#ffeb3b","#ffc107","#ff9800","#ff5722","#795548","#9e9e9e","#607d8b"],["#e53935","#d81b60","#8e24aa","#3949ab","#1e88e5","#00acc1","#00897b","#43a047","#7cb342","#c0ca33","#fdd835","#ffb300","#fb8c00","#f4511e","#6d4c41","#757575","#546e7a"],["#d32f2f","#c2185b","#7b1fa2","#303f9f","#1976d2","#0097a7","#00796b","#388e3c","#689f38","#afb42b","#fbc02d","#ffa000","#f57c00","#e64a19","#5d4037","#616161","#455a64"],["#c62828","#ad1457","#6a1b9a","#283593","#1565c0","#00838f","#00695c","#2e7d32","#558b2f","#9e9d24","#f9a825","#ff8f00","#ef6c00","#d84315","#4e342e","#424242","#37474f"],["#b71c1c","#880e4f","#4a148c","#1a237e","#0d47a1","#006064","#004d40","#1b5e20","#33691e","#827717","#f57f17","#ff6f00","#e65100","#bf360c","#3e2723","#212121","#263238"],],fire:[["0b1a6d","840f38","b60718","de030b","ff0c0c","fd491c","fc7521","faa331","fbb535","ffc73a"],["071147","5f0b28","930513","be0309","ef0000","fa3403","fb670b","f9991b","faad1e","ffc123"],["03071e","370617","6a040f","9d0208","d00000","dc2f02","e85d04","f48c06","faa307","ffba08"],["020619","320615","61040d","8c0207","bc0000","c82a02","d05203","db7f06","e19405","efab00"],["020515","2d0513","58040c","7f0206","aa0000","b62602","b94903","c57205","ca8504","d89b00"],],baby:[["eddcd2","fff1e6","fde2e4","fad2e1","c5dedd","dbe7e4","f0efeb","d6e2e9","bcd4e6","99c1de"],["e1c4b3","ffd5b5","fab6ba","f5a8c4","aacecd","bfd5cf","dbd9d0","baceda","9dc0db","7eb1d5"],["daa990","ffb787","f88e95","f282a9","8fc4c3","a3c8be","cec9b3","9dbcce","82acd2","649dcb"],["d69070","ff9c5e","f66770","f05f8f","74bbb9","87bfae","c5b993","83aac3","699bca","4d89c2"],["c97d5d","f58443","eb4d57","e54a7b","66a9a7","78ae9c","b5a67e","7599b1","5c88b7","4978aa"],],chart:[['#C1D37F','#4C5454','#FFD275','#66586F','#D05D5B','#C96480','#95BF8F','#6EA240','#0F0F0E','#EB8258','#95A3B3','#995D81'],],}
var component=function(o){if(palette[o]){return palette[o];}else{return palette.material;}}
component.get=function(o){if(palette[o]){return palette[o];}else{return palette;}}
component.set=function(o,v){palette[o]=v;}
return component;})();jSuites.picker=(function(el,options){if(el.picker){return el.picker.setOptions(options,true);}
var obj={type:'picker'};obj.options={};var dropdownHeader=null;var dropdownContent=null;var createContent=function(){dropdownContent.innerHTML='';var keys=Object.keys(obj.options.data);for(var i=0;i<keys.length;i++){var dropdownItem=document.createElement('div');dropdownItem.classList.add('jpicker-item');dropdownItem.k=keys[i];dropdownItem.v=obj.options.data[keys[i]];dropdownItem.innerHTML=obj.getLabel(keys[i]);dropdownContent.appendChild(dropdownItem);}}
obj.setOptions=function(options,reset){var defaults={value:0,data:null,render:null,onchange:null,onselect:null,onopen:null,onclose:null,onload:null,width:null,header:true,right:false,content:false,columns:null,height:null,}
if(options&&options.options){options.data=options.options;}
for(var property in defaults){if(options&&options.hasOwnProperty(property)){obj.options[property]=options[property];}else{if(typeof(obj.options[property])=='undefined'||reset===true){obj.options[property]=defaults[property];}}}
if(obj.options.header===false){dropdownHeader.style.display='none';}else{dropdownHeader.style.display='';}
if(obj.options.width){dropdownHeader.style.width=parseInt(obj.options.width)+'px';}else{dropdownHeader.style.width='';}
if(obj.options.height){dropdownContent.style.maxHeight=obj.options.height+'px';dropdownContent.style.overflow='scroll';}else{dropdownContent.style.overflow='';}
if(obj.options.columns>0){dropdownContent.classList.add('jpicker-columns');dropdownContent.style.width=obj.options.width?obj.options.width:36*obj.options.columns+'px';}
if(isNaN(obj.options.value)){obj.options.value='0';}
createContent();obj.setValue(obj.options.value);return obj;}
obj.getValue=function(){return obj.options.value;}
obj.setValue=function(v){obj.setLabel(v);obj.options.value=String(v);if(el.value!=obj.options.value){el.value=obj.options.value;if(typeof(el.oninput)=='function'){el.oninput({type:'input',target:el,value:el.value});}}
if(dropdownContent.children[v].getAttribute('type')!=='generic'){obj.close();}}
obj.getLabel=function(v){var label=obj.options.data[v]||null;if(typeof(obj.options.render)=='function'){label=obj.options.render(label);}
return label;}
obj.setLabel=function(v){if(obj.options.content){var label='<i class="material-icons">'+obj.options.content+'</i>';}else{var label=obj.getLabel(v);}
dropdownHeader.innerHTML=label;}
obj.open=function(){if(!el.classList.contains('jpicker-focus')){jSuites.tracking(obj,true);el.classList.add('jpicker-focus');el.focus();var top=0;var left=0;dropdownContent.style.marginLeft='';var rectHeader=dropdownHeader.getBoundingClientRect();var rectContent=dropdownContent.getBoundingClientRect();if(window.innerHeight<rectHeader.bottom+rectContent.height){top=-1*(rectContent.height+4);}else{top=rectHeader.height+4;}
if(obj.options.right===true){left=-1*rectContent.width+rectHeader.width;}
if(rectContent.left+left<0){left=left+rectContent.left+10;}
if(rectContent.left+rectContent.width>window.innerWidth){left=-1*(10+rectContent.left+rectContent.width-window.innerWidth);}
dropdownContent.style.marginTop=parseInt(top)+'px';dropdownContent.style.marginLeft=parseInt(left)+'px';if(typeof obj.options.onopen=='function'){obj.options.onopen(el,obj);}}}
obj.close=function(){if(el.classList.contains('jpicker-focus')){el.classList.remove('jpicker-focus');jSuites.tracking(obj,false);if(typeof obj.options.onclose=='function'){obj.options.onclose(el,obj);}}}
var init=function(){el.classList.add('jpicker');el.setAttribute('tabindex','900');el.onmousedown=function(e){if(!el.classList.contains('jpicker-focus')){obj.open();}}
dropdownHeader=document.createElement('div');dropdownHeader.classList.add('jpicker-header');dropdownContent=document.createElement('div');dropdownContent.classList.add('jpicker-content');dropdownContent.onclick=function(e){var item=jSuites.findElement(e.target,'jpicker-item');if(item){if(item.parentNode===dropdownContent){obj.setValue(item.k);if(typeof(obj.options.onchange)=='function'){obj.options.onchange.call(obj,el,obj,item.v,item.v,item.k,e);}}}}
el.appendChild(dropdownHeader);el.appendChild(dropdownContent);el.value=options.value||0;obj.setOptions(options);if(typeof(obj.options.onload)=='function'){obj.options.onload(el,obj);}
el.change=obj.setValue;el.val=function(val){if(val===undefined){return obj.getValue();}else{obj.setValue(val);}}
el.picker=obj;}
init();return obj;});jSuites.progressbar=(function(el,options){var obj={};obj.options={};var defaults={value:0,onchange:null,width:null,};for(var property in defaults){if(options&&options.hasOwnProperty(property)){obj.options[property]=options[property];}else{obj.options[property]=defaults[property];}}
el.classList.add('jprogressbar');el.setAttribute('tabindex',1);el.setAttribute('data-value',obj.options.value);var bar=document.createElement('div');bar.style.width=obj.options.value+'%';bar.style.color='#fff';el.appendChild(bar);if(obj.options.width){el.style.width=obj.options.width;}
obj.setValue=function(value){value=parseInt(value);obj.options.value=value;bar.style.width=value+'%';el.setAttribute('data-value',value+'%');if(value<6){el.style.color='#000';}else{el.style.color='#fff';}
obj.options.value=value;if(typeof(obj.options.onchange)=='function'){obj.options.onchange(el,value);}
if(el.value!=obj.options.value){el.value=obj.options.value;if(typeof(el.oninput)=='function'){el.oninput({type:'input',target:el,value:el.value});}}}
obj.getValue=function(){return obj.options.value;}
var action=function(e){if(e.which){var rect=el.getBoundingClientRect();if(e.changedTouches&&e.changedTouches[0]){var x=e.changedTouches[0].clientX;var y=e.changedTouches[0].clientY;}else{var x=e.clientX;var y=e.clientY;}
obj.setValue(Math.round((x-rect.left)/rect.width*100));}}
if('touchstart'in document.documentElement===true){el.addEventListener('touchstart',action);el.addEventListener('touchend',action);}else{el.addEventListener('mousedown',action);el.addEventListener("mousemove",action);}
el.change=obj.setValue;el.val=function(val){if(val===undefined){return obj.getValue();}else{obj.setValue(val);}}
el.progressbar=obj;return obj;});jSuites.rating=(function(el,options){if(el.rating){return el.rating.setOptions(options,true);}
var obj={};obj.options={};obj.setOptions=function(options,reset){var defaults={number:5,value:0,tooltip:['Very bad','Bad','Average','Good','Very good'],onchange:null,};for(var property in defaults){if(options&&options.hasOwnProperty(property)){obj.options[property]=options[property];}else{if(typeof(obj.options[property])=='undefined'||reset===true){obj.options[property]=defaults[property];}}}
el.innerHTML='';for(var i=0;i<obj.options.number;i++){var div=document.createElement('div');div.setAttribute('data-index',(i+1))
div.setAttribute('title',obj.options.tooltip[i])
el.appendChild(div);}
if(obj.options.value){for(var i=0;i<obj.options.number;i++){if(i<obj.options.value){el.children[i].classList.add('jrating-selected');}}}
return obj;}
obj.setValue=function(index){for(var i=0;i<obj.options.number;i++){if(i<index){el.children[i].classList.add('jrating-selected');}else{el.children[i].classList.remove('jrating-over');el.children[i].classList.remove('jrating-selected');}}
obj.options.value=index;if(typeof(obj.options.onchange)=='function'){obj.options.onchange(el,index);}
if(el.value!=obj.options.value){el.value=obj.options.value;if(typeof(el.oninput)=='function'){el.oninput({type:'input',target:el,value:el.value});}}}
obj.getValue=function(){return obj.options.value;}
var init=function(){obj.setOptions(options);el.classList.add('jrating');el.addEventListener("click",function(e){var index=e.target.getAttribute('data-index');if(index!=undefined){if(index==obj.options.value){obj.setValue(0);}else{obj.setValue(index);}}});el.addEventListener("mouseover",function(e){var index=e.target.getAttribute('data-index');for(var i=0;i<obj.options.number;i++){if(i<index){el.children[i].classList.add('jrating-over');}else{el.children[i].classList.remove('jrating-over');}}});el.addEventListener("mouseout",function(e){for(var i=0;i<obj.options.number;i++){el.children[i].classList.remove('jrating-over');}});el.change=obj.setValue;el.val=function(val){if(val===undefined){return obj.getValue();}else{obj.setValue(val);}}
el.rating=obj;}
init();return obj;});jSuites.search=(function(el,options){if(el.search){return el.search;}
var index=null;var select=function(e){if(e.target.classList.contains('jsearch_item')){var element=e.target;}else{var element=e.target.parentNode;}
obj.selectIndex(element);e.preventDefault();}
var createList=function(data){container.innerHTML='';if(!data.length){el.style.display='';}else{el.style.display='block';var len=data.length<11?data.length:10;for(var i=0;i<len;i++){if(typeof(data[i])=='string'){var text=data[i];var value=data[i];}else{var text=data[i].text;if(!text&&data[i].name){text=data[i].name;}
var value=data[i].value;if(!value&&data[i].id){value=data[i].id;}}
var div=document.createElement('div');div.setAttribute('data-value',value);div.setAttribute('data-text',text);div.className='jsearch_item';if(data[i].id){div.setAttribute('id',data[i].id)}
if(obj.options.forceSelect&&i==0){div.classList.add('selected');}
var img=document.createElement('img');if(data[i].image){img.src=data[i].image;}else{img.style.display='none';}
div.appendChild(img);var item=document.createElement('div');item.innerHTML=text;div.appendChild(item);container.appendChild(div);}}}
var execute=function(str){if(str!=obj.terms){obj.terms=str;if(obj.options.forceSelect){index=0;}else{index=null;}
if(Array.isArray(obj.options.data)){var test=function(o){if(typeof(o)=='string'){if((''+o).toLowerCase().search(str.toLowerCase())>=0){return true;}}else{for(var key in o){var value=o[key];if((''+value).toLowerCase().search(str.toLowerCase())>=0){return true;}}}
return false;}
var results=obj.options.data.filter(function(item){return test(item);});createList(results);}else{jSuites.ajax({url:obj.options.data+str,method:'GET',dataType:'json',success:function(data){createList(data);}});}}}
var timer=null;var obj=function(str){if(timer){clearTimeout(timer);}
timer=setTimeout(function(){execute(str);},500);}
if(options.forceSelect===null){options.forceSelect=true;}
obj.options={data:options.data||null,input:options.input||null,searchByNode:options.searchByNode||null,onselect:options.onselect||null,forceSelect:options.forceSelect,onbeforesearch:options.onbeforesearch||null,};obj.selectIndex=function(item){var id=item.getAttribute('id');var text=item.getAttribute('data-text');var value=item.getAttribute('data-value');if(typeof(obj.options.onselect)=='function'){obj.options.onselect(obj,text,value,id);}
obj.close();}
obj.open=function(){el.style.display='block';}
obj.close=function(){if(timer){clearTimeout(timer);}
obj.terms='';container.innerHTML='';el.style.display='';}
obj.isOpened=function(){return el.style.display?true:false;}
obj.keydown=function(e){if(obj.isOpened()){if(e.key=='Enter'){if(index!==null&&container.children[index]){obj.selectIndex(container.children[index]);e.preventDefault();}else{obj.close();}}else if(e.key==='ArrowUp'){if(index!==null&&container.children[0]){container.children[index].classList.remove('selected');if(!obj.options.forceSelect&&index===0){index=null;}else{index=Math.max(0,index-1);container.children[index].classList.add('selected');}}
e.preventDefault();}else if(e.key==='ArrowDown'){if(index==null){index=-1;}else{container.children[index].classList.remove('selected');}
if(index<9&&container.children[index+1]){index++;}
container.children[index].classList.add('selected');e.preventDefault();}}}
obj.keyup=function(e){if(!obj.options.searchByNode){if(obj.options.input.tagName==='DIV'){var terms=obj.options.input.innerText;}else{var terms=obj.options.input.value;}}else{var node=jSuites.getNode();if(node){var terms=node.innerText;}}
if(typeof(obj.options.onbeforesearch)=='function'){var ret=obj.options.onbeforesearch(obj,terms);if(ret){terms=ret;}else{if(ret===false){return;}}}
obj(terms);}
if(obj.options.input){obj.options.input.addEventListener("keyup",obj.keyup);obj.options.input.addEventListener("keydown",obj.keydown);}
var container=document.createElement('div');container.classList.add('jsearch_container');container.onmousedown=select;el.appendChild(container);el.classList.add('jsearch');el.search=obj;return obj;});jSuites.slider=(function(el,options){var obj={};obj.options={};obj.currentImage=null;if(options){obj.options=options;}
el.setAttribute('tabindex','900')
obj.options.items=[];if(!el.classList.contains('jslider')){el.classList.add('jslider');el.classList.add('unselectable');if(obj.options.height){el.style.minHeight=obj.options.height;}
if(obj.options.width){el.style.width=obj.options.width;}
if(obj.options.grid){el.classList.add('jslider-grid');var number=el.children.length;if(number>4){el.setAttribute('data-total',number-4);}
el.setAttribute('data-number',(number>4?4:number));}
var counter=document.createElement('div');counter.classList.add('jslider-counter');if(el.children.length>0){for(var i=0;i<el.children.length;i++){obj.options.items.push(el.children[i]);var item=document.createElement('div');item.onclick=function(){var index=Array.prototype.slice.call(counter.children).indexOf(this);obj.show(obj.currentImage=obj.options.items[index]);}
counter.appendChild(item);}}
var caption=document.createElement('div');caption.className='jslider-caption';var controls=document.createElement('div');var close=document.createElement('div');close.className='jslider-close';close.innerHTML='';close.onclick=function(){obj.close();}
controls.appendChild(caption);controls.appendChild(close);}
obj.updateCounter=function(index){for(var i=0;i<counter.children.length;i++){if(counter.children[i].classList.contains('jslider-counter-focus')){counter.children[i].classList.remove('jslider-counter-focus');break;}}
counter.children[index].classList.add('jslider-counter-focus');}
obj.show=function(target){if(!target){var target=el.children[0];}
el.classList.add('jslider-focus');el.classList.remove('jslider-grid');el.appendChild(controls);el.appendChild(counter);var index=obj.options.items.indexOf(target);obj.updateCounter(index);for(var i=0;i<el.children.length;i++){el.children[i].style.display='';}
target.style.display='block';if(target.previousElementSibling){el.classList.add('jslider-left');}else{el.classList.remove('jslider-left');}
if(target.nextElementSibling&&target.nextElementSibling.tagName=='IMG'){el.classList.add('jslider-right');}else{el.classList.remove('jslider-right');}
obj.currentImage=target;if(obj.currentImage.offsetHeight>obj.currentImage.offsetWidth){obj.currentImage.classList.add('jslider-vertical');}
controls.children[0].innerText=obj.currentImage.getAttribute('title');}
obj.open=function(){obj.show();if(typeof(obj.options.onopen)=='function'){obj.options.onopen(el);}}
obj.close=function(){el.classList.remove('jslider-focus');el.classList.remove('jslider-left');el.classList.remove('jslider-right');if(obj.options.grid){el.classList.add('jslider-grid');}
for(var i=0;i<el.children.length;i++){el.children[i].style.display='';}
counter.remove();controls.remove();obj.currentImage=null;if(typeof(obj.options.onclose)=='function'){obj.options.onclose(el);}}
obj.reset=function(){el.innerHTML='';}
obj.next=function(){var nextImage=obj.currentImage.nextElementSibling;if(nextImage&&nextImage.tagName==='IMG'){obj.show(obj.currentImage.nextElementSibling);}}
obj.prev=function(){if(obj.currentImage.previousElementSibling){obj.show(obj.currentImage.previousElementSibling);}}
var mouseUp=function(e){if(e.target.tagName=='IMG'){obj.show(e.target);}else if(!e.target.classList.contains('jslider-close')&&!(e.target.parentNode.classList.contains('jslider-counter')||e.target.classList.contains('jslider-counter'))){var offsetX=e.offsetX||e.changedTouches[0].clientX;if(e.target.clientWidth-offsetX<40){obj.next();}else if(offsetX<40){obj.prev();}}}
if('ontouchend'in document.documentElement===true){el.addEventListener('touchend',mouseUp);}else{el.addEventListener('mouseup',mouseUp);}
el.addEventListener("swipeleft",function(e){obj.next();e.preventDefault();e.stopPropagation();});el.addEventListener("swiperight",function(e){obj.prev();e.preventDefault();e.stopPropagation();});el.addEventListener('keydown',function(e){if(e.which==27){obj.close();}});el.slider=obj;return obj;});jSuites.sorting=(function(el,options){var obj={};obj.options={};var defaults={pointer:null,direction:null,ondragstart:null,ondragend:null,ondrop:null,}
var dragElement=null;for(var property in defaults){if(options&&options.hasOwnProperty(property)){obj.options[property]=options[property];}else{obj.options[property]=defaults[property];}}
el.classList.add('jsorting');el.addEventListener('dragstart',function(e){var position=Array.prototype.indexOf.call(e.target.parentNode.children,e.target);dragElement={element:e.target,o:position,d:position}
e.target.style.opacity='0.25';if(typeof(obj.options.ondragstart)=='function'){obj.options.ondragstart(el,e.target,e);}});el.addEventListener('dragover',function(e){e.preventDefault();if(getElement(e.target)&&dragElement){if(e.target.getAttribute('draggable')=='true'&&dragElement.element!=e.target){if(!obj.options.direction){var condition=e.target.clientHeight/2>e.offsetY;}else{var condition=e.target.clientWidth/2>e.offsetX;}
if(condition){e.target.parentNode.insertBefore(dragElement.element,e.target);}else{e.target.parentNode.insertBefore(dragElement.element,e.target.nextSibling);}
dragElement.d=Array.prototype.indexOf.call(e.target.parentNode.children,dragElement.element);}}});el.addEventListener('dragleave',function(e){e.preventDefault();});el.addEventListener('dragend',function(e){e.preventDefault();if(dragElement){if(typeof(obj.options.ondragend)=='function'){obj.options.ondragend(el,dragElement.element,e);}
if(dragElement.o<dragElement.d){e.target.parentNode.insertBefore(dragElement.element,e.target.parentNode.children[dragElement.o]);}else{e.target.parentNode.insertBefore(dragElement.element,e.target.parentNode.children[dragElement.o].nextSibling);}
dragElement.element.style.opacity='';dragElement=null;}});el.addEventListener('drop',function(e){e.preventDefault();if(dragElement&&(dragElement.o!=dragElement.d)){if(typeof(obj.options.ondrop)=='function'){obj.options.ondrop(el,dragElement.o,dragElement.d,dragElement.element,e.target,e);}}
dragElement.element.style.opacity='';dragElement=null;});var getElement=function(element){var sorting=false;function path(element){if(element.className){if(element.classList.contains('jsorting')){sorting=true;}}
if(!sorting){path(element.parentNode);}}
path(element);return sorting;}
for(var i=0;i<el.children.length;i++){if(!el.children[i].hasAttribute('draggable')){el.children[i].setAttribute('draggable','true');}}
el.val=function(){var id=null;var data=[];for(var i=0;i<el.children.length;i++){if(id=el.children[i].getAttribute('data-id')){data.push(id);}}
return data;}
return el;});jSuites.tabs=(function(el,options){var obj={};obj.options={};var defaults={data:[],position:null,allowCreate:false,allowChangePosition:false,onclick:null,onload:null,onchange:null,oncreate:null,ondelete:null,onbeforecreate:null,onchangeposition:null,animation:false,hideHeaders:false,padding:null,palette:null,maxWidth:null,}
for(var property in defaults){if(options&&options.hasOwnProperty(property)){obj.options[property]=options[property];}else{obj.options[property]=defaults[property];}}
el.classList.add('jtabs');var prev=null;var next=null;var border=null;var setBorder=function(index){if(obj.options.animation){var rect=obj.headers.children[index].getBoundingClientRect();if(obj.options.palette=='modern'){border.style.width=rect.width-4+'px';border.style.left=obj.headers.children[index].offsetLeft+2+'px';}else{border.style.width=rect.width+'px';border.style.left=obj.headers.children[index].offsetLeft+'px';}
if(obj.options.position=='bottom'){border.style.top='0px';}else{border.style.bottom='0px';}}}
var updateControls=function(x){if(typeof(obj.headers.scrollTo)=='function'){obj.headers.scrollTo({left:x,behavior:'smooth',});}else{obj.headers.scrollLeft=x;}
if(x<=1){prev.classList.add('disabled');}else{prev.classList.remove('disabled');}
if(x>=obj.headers.scrollWidth-obj.headers.offsetWidth){next.classList.add('disabled');}else{next.classList.remove('disabled');}
if(obj.headers.scrollWidth<=obj.headers.offsetWidth){prev.style.display='none';next.style.display='none';}else{prev.style.display='';next.style.display='';}}
obj.setBorder=setBorder;obj.open=function(index){var previous=null;for(var i=0;i<obj.headers.children.length;i++){if(obj.headers.children[i].classList.contains('jtabs-selected')){previous=i;}
obj.headers.children[i].classList.remove('jtabs-selected');if(obj.content.children[i]){obj.content.children[i].classList.remove('jtabs-selected');}}
obj.headers.children[index].classList.add('jtabs-selected');if(obj.content.children[index]){obj.content.children[index].classList.add('jtabs-selected');}
if(previous!=index&&typeof(obj.options.onchange)=='function'){if(obj.content.children[index]){obj.options.onchange(el,obj,index,obj.headers.children[index],obj.content.children[index]);}}
if(obj.options.hideHeaders==true&&(obj.headers.children.length<3&&obj.options.allowCreate==false)){obj.headers.parentNode.style.display='none';}else{setBorder(index);obj.headers.parentNode.style.display='';var x1=obj.headers.children[index].offsetLeft;var x2=x1+obj.headers.children[index].offsetWidth;var r1=obj.headers.scrollLeft;var r2=r1+obj.headers.offsetWidth;if(!(r1<=x1&&r2>=x2)){updateControls(x1-1);}}}
obj.selectIndex=function(a){var index=Array.prototype.indexOf.call(obj.headers.children,a);if(index>=0){obj.open(index);}
return index;}
obj.rename=function(i,title){if(!title){title=prompt('New title',obj.headers.children[i].innerText);}
obj.headers.children[i].innerText=title;obj.open(i);}
obj.create=function(title,url){if(typeof(obj.options.onbeforecreate)=='function'){var ret=obj.options.onbeforecreate(el);if(ret===false){return false;}else{title=ret;}}
var div=obj.appendElement(title);if(typeof(obj.options.oncreate)=='function'){obj.options.oncreate(el,div)}
return div;}
obj.remove=function(index){return obj.deleteElement(index);}
obj.nextNumber=function(){var num=0;for(var i=0;i<obj.headers.children.length;i++){var tmp=obj.headers.children[i].innerText.match(/[0-9].*/);if(tmp>num){num=parseInt(tmp);}}
if(!num){num=1;}else{num++;}
return num;}
obj.deleteElement=function(index){if(!obj.headers.children[index]){return false;}else{obj.headers.removeChild(obj.headers.children[index]);obj.content.removeChild(obj.content.children[index]);}
obj.open(0);if(typeof(obj.options.ondelete)=='function'){obj.options.ondelete(el,index)}}
obj.appendElement=function(title,cb){if(!title){var title=prompt('Title?','');}
if(title){var div=document.createElement('div');obj.content.appendChild(div);var h=document.createElement('div');h.innerHTML=title;h.content=div;obj.headers.insertBefore(h,obj.headers.lastChild);if(obj.options.allowChangePosition){h.setAttribute('draggable','true');}
obj.selectIndex(h);if(typeof(cb)=='function'){cb(div,h);}
return div;}}
obj.getActive=function(){for(var i=0;i<obj.headers.children.length;i++){if(obj.headers.children[i].classList.contains('jtabs-selected')){return i}}
return 0;}
obj.updateContent=function(position,newContent){if(typeof newContent!=='string'){var contentItem=newContent;}else{var contentItem=document.createElement('div');contentItem.innerHTML=newContent;}
if(obj.content.children[position].classList.contains('jtabs-selected')){newContent.classList.add('jtabs-selected');}
obj.content.replaceChild(newContent,obj.content.children[position]);}
obj.updatePosition=function(f,t){if(f>t){obj.content.insertBefore(obj.content.children[f],obj.content.children[t]);}else{obj.content.insertBefore(obj.content.children[f],obj.content.children[t].nextSibling);}
obj.open(t);if(typeof(obj.options.onchangeposition)=='function'){obj.options.onchangeposition(obj.headers,f,t);}}
obj.move=function(f,t){if(f>t){obj.headers.insertBefore(obj.headers.children[f],obj.headers.children[t]);}else{obj.headers.insertBefore(obj.headers.children[f],obj.headers.children[t].nextSibling);}
obj.updatePosition(f,t);}
obj.setBorder=setBorder;obj.init=function(){el.innerHTML='';obj.headers=document.createElement('div');obj.content=document.createElement('div');obj.headers.classList.add('jtabs-headers');obj.content.classList.add('jtabs-content');if(obj.options.palette){el.classList.add('jtabs-modern');}else{el.classList.remove('jtabs-modern');}
if(obj.options.padding){obj.content.style.padding=parseInt(obj.options.padding)+'px';}
var header=document.createElement('div');header.className='jtabs-headers-container';header.appendChild(obj.headers);if(obj.options.maxWidth){header.style.maxWidth=parseInt(obj.options.maxWidth)+'px';}
var controls=document.createElement('div');controls.className='jtabs-controls';controls.setAttribute('draggable','false');header.appendChild(controls);if(obj.options.position=='bottom'){el.appendChild(obj.content);el.appendChild(header);}else{el.appendChild(header);el.appendChild(obj.content);}
if(obj.options.allowCreate==true){var add=document.createElement('div');add.className='jtabs-add';add.onclick=function(){obj.create();}
controls.appendChild(add);}
prev=document.createElement('div');prev.className='jtabs-prev';prev.onclick=function(){updateControls(obj.headers.scrollLeft-obj.headers.offsetWidth);}
controls.appendChild(prev);next=document.createElement('div');next.className='jtabs-next';next.onclick=function(){updateControls(obj.headers.scrollLeft+obj.headers.offsetWidth);}
controls.appendChild(next);for(var i=0;i<obj.options.data.length;i++){if(obj.options.data[i].titleElement){var headerItem=obj.options.data[i].titleElement;}else{var headerItem=document.createElement('div');}
if(obj.options.data[i].icon){var iconContainer=document.createElement('div');var icon=document.createElement('i');icon.classList.add('material-icons');icon.innerHTML=obj.options.data[i].icon;iconContainer.appendChild(icon);headerItem.appendChild(iconContainer);}
if(obj.options.data[i].title){var title=document.createTextNode(obj.options.data[i].title);headerItem.appendChild(title);}
if(obj.options.data[i].width){headerItem.style.width=obj.options.data[i].width;}
if(obj.options.data[i].contentElement){var contentItem=obj.options.data[i].contentElement;}else{var contentItem=document.createElement('div');contentItem.innerHTML=obj.options.data[i].content;}
obj.headers.appendChild(headerItem);obj.content.appendChild(contentItem);}
border=document.createElement('div');border.className='jtabs-border';obj.headers.appendChild(border);if(obj.options.animation){el.classList.add('jtabs-animation');}
obj.headers.addEventListener("click",function(e){if(e.target.parentNode.classList.contains('jtabs-headers')){var target=e.target;}else{if(e.target.tagName=='I'){var target=e.target.parentNode.parentNode;}else{var target=e.target.parentNode;}}
var index=obj.selectIndex(target);if(typeof(obj.options.onclick)=='function'){obj.options.onclick(el,obj,index,obj.headers.children[index],obj.content.children[index]);}});obj.headers.addEventListener("contextmenu",function(e){obj.selectIndex(e.target);});if(obj.headers.children.length){obj.open(0);}
updateControls(0);if(obj.options.allowChangePosition==true){jSuites.sorting(obj.headers,{direction:1,ondrop:function(a,b,c){obj.updatePosition(b,c);},});}
if(typeof(obj.options.onload)=='function'){obj.options.onload(el,obj);}}
if(el.children[0]&&el.children[0].children.length){for(var i=0;i<el.children[0].children.length;i++){var item=obj.options.data&&obj.options.data[i]?obj.options.data[i]:{};if(el.children[1]&&el.children[1].children[i]){item.titleElement=el.children[0].children[i];item.contentElement=el.children[1].children[i];}else{item.contentElement=el.children[0].children[i];}
obj.options.data[i]=item;}}
var loadingRemoteData=false;if(obj.options.data){for(var i=0;i<obj.options.data.length;i++){if(obj.options.data[i].url){jSuites.ajax({url:obj.options.data[i].url,type:'GET',dataType:'text/html',index:i,success:function(result){obj.options.data[this.index].content=result;},complete:function(){obj.init();}});loadingRemoteData=true;}}}
if(!loadingRemoteData){obj.init();}
el.tabs=obj;return obj;});jSuites.tags=(function(el,options){if(el.tags){return el.tags.setOptions(options,true);}
var obj={type:'tags'};obj.options={};var limit=function(){return obj.options.limit&&el.children.length>=obj.options.limit?true:false;}
var search=null;var searchContainer=null;obj.setOptions=function(options,reset){var defaults={value:'',limit:null,limitMessage:null,search:null,placeholder:null,validation:null,onbeforepaste:null,onbeforechange:null,onlimit:null,onchange:null,onfocus:null,onblur:null,onload:null,colors:null,}
for(var property in defaults){if(options&&options.hasOwnProperty(property)){obj.options[property]=options[property];}else{if(typeof(obj.options[property])=='undefined'||reset===true){obj.options[property]=defaults[property];}}}
if(obj.options.placeholder){el.setAttribute('data-placeholder',obj.options.placeholder);}else{el.removeAttribute('data-placeholder');}
el.placeholder=obj.options.placeholder;obj.setValue(obj.options.value);filter();if(obj.options.search){if(!searchContainer){searchContainer=document.createElement('div');el.parentNode.insertBefore(searchContainer,el.nextSibling);search=jSuites.search(searchContainer,{data:obj.options.search,onselect:function(a,b,c){obj.selectIndex(b,c);}});}}else{if(searchContainer){search=null;searchContainer.remove();searchContainer=null;}}
return obj;}
obj.add=function(value,focus){if(typeof(obj.options.onbeforechange)=='function'){var ret=obj.options.onbeforechange(el,obj,obj.options.value,value);if(ret===false){return false;}else{if(ret!=null){value=ret;}}}
if(search){search.close();}
if(limit()){if(typeof(obj.options.onlimit)=='function'){obj.options.onlimit(obj,obj.options.limit);}else if(obj.options.limitMessage){alert(obj.options.limitMessage+' '+obj.options.limit);}}else{var node=jSuites.getNode();if(node&&node.parentNode&&node.parentNode.classList.contains('jtags')&&node.nextSibling&&(!(node.nextSibling.innerText&&node.nextSibling.innerText.trim()))){div=node.nextSibling;}else{if(el.lastChild){if(!el.lastChild.innerText.trim()){el.removeChild(el.lastChild);}}
if(!value||typeof(value)=='string'){var div=createElement(value,value,node);}else{for(var i=0;i<=value.length;i++){if(!limit()){if(!value[i]||typeof(value[i])=='string'){var t=value[i]||'';var v=null;}else{var t=value[i].text;var v=value[i].value;}
var div=createElement(t,v);}}}
change();}
if(focus){setFocus(div);}}}
obj.setLimit=function(limit){obj.options.limit=limit;var n=el.children.length-limit;while(el.children.length>limit){el.removeChild(el.lastChild);}}
obj.remove=function(node){node.parentNode.removeChild(node);if(!el.children.length){obj.add('',true);}else{change();}}
obj.getData=function(){var data=[];for(var i=0;i<el.children.length;i++){var text=el.children[i].innerText.replace("\n","");var value=el.children[i].getAttribute('data-value');if(!value){value=text;}
if(text||value){data.push({text:text,value:value});}}
return data;}
obj.getValue=function(index){var value=null;if(index!=null){value=el.children[index].getAttribute('data-value');if(!value){value=el.children[index].innerText.replace("\n","");}}else{var data=[];for(var i=0;i<el.children.length;i++){value=el.children[i].innerText.replace("\n","");if(value){data.push(obj.getValue(i));}}
value=data.join(',');}
return value;}
obj.setValue=function(mixed){if(!mixed){obj.reset();}else{if(el.value!=mixed){if(Array.isArray(mixed)){obj.add(mixed);}else{var text=(''+mixed).trim();var data=extractTags(text);el.innerHTML='';obj.add(data);}}}}
obj.reset=function(){el.classList.add('jtags-empty');el.innerHTML='<div></div>';change();}
obj.isValid=function(){var test=0;for(var i=0;i<el.children.length;i++){if(el.children[i].classList.contains('jtags_error')){test++;}}
return test==0?true:false;}
obj.selectIndex=function(text,value){var node=jSuites.getNode();if(node){node.innerText=text;if(value){node.setAttribute('data-value',value);}
node.classList.remove('jtags_error');if(!limit()){obj.add('',true);}}}
obj.search=function(node){var terms=node.innerText;}
obj.destroy=function(){el.removeEventListener('mouseup',tagsMouseUp);el.removeEventListener('keydown',tagsKeyDown);el.removeEventListener('keyup',tagsKeyUp);el.removeEventListener('paste',tagsPaste);el.removeEventListener('focus',tagsFocus);el.removeEventListener('blur',tagsBlur);el.parentNode.removeChild(el);}
var setFocus=function(node){if(el.children.length>1){var range=document.createRange();var sel=window.getSelection();if(!node){var node=el.childNodes[el.childNodes.length-1];}
range.setStart(node,node.length)
range.collapse(true)
sel.removeAllRanges()
sel.addRange(range)
el.scrollLeft=el.scrollWidth;}}
var createElement=function(label,value,node){var div=document.createElement('div');div.innerHTML=label?label:'';if(value){div.setAttribute('data-value',value);}
if(node&&node.parentNode.classList.contains('jtags')){el.insertBefore(div,node.nextSibling);}else{el.appendChild(div);}
return div;}
var change=function(){var value=obj.getValue();if(value!=obj.options.value){obj.options.value=value;if(typeof(obj.options.onchange)=='function'){obj.options.onchange(el,obj,obj.options.value);}
if(el.value!=obj.options.value){el.value=obj.options.value;if(typeof(el.oninput)=='function'){el.oninput({type:'input',target:el,value:el.value});}}}
filter();}
var filter=function(){for(var i=0;i<el.children.length;i++){if(!obj.getValue(i)){el.children[i].classList.remove('jtags_label');}else{el.children[i].classList.add('jtags_label');if(typeof(obj.options.validation)=='function'){if(obj.getValue(i)){if(!obj.options.validation(el.children[i],el.children[i].innerText,el.children[i].getAttribute('data-value'))){el.children[i].classList.add('jtags_error');}else{el.children[i].classList.remove('jtags_error');}}else{el.children[i].classList.remove('jtags_error');}}else{el.children[i].classList.remove('jtags_error');}}}
isEmpty();}
var isEmpty=function(){if(!el.innerText.trim()){el.innerHTML='<div></div>';el.classList.add('jtags-empty');}else{el.classList.remove('jtags-empty');}}
var extractTags=function(text){var data=[];var word='';text=text.trim();if(text){for(var i=0;i<text.length;i++){if(text[i]==','||text[i]==';'||text[i]=='\n'){if(word){data.push(word.trim());word='';}}else{word+=text[i];}}
if(word){data.push(word);}}
return data;}
var anchorOffset=0;var tagsKeyDown=function(e){anchorOffset=window.getSelection().anchorOffset;isEmpty();if(e.key==='Tab'||e.key===';'||e.key===','){var n=window.getSelection().anchorOffset;if(n>1){if(limit()){if(typeof(obj.options.onlimit)=='function'){obj.options.onlimit(obj,obj.options.limit)}}else{obj.add('',true);}}
e.preventDefault();}else if(e.key=='Enter'){if(!search||!search.isOpened()){var n=window.getSelection().anchorOffset;if(n>1){if(!limit()){obj.add('',true);}}
e.preventDefault();}}else if(e.key=='Backspace'){if(el.children.length==1&&window.getSelection().anchorOffset<1){e.preventDefault();}}
if(search){search.keydown(e);}}
var tagsKeyUp=function(e){if(e.which==39){var n=window.getSelection().anchorOffset;if(n>1&&n==anchorOffset){obj.add('',true);}}else if(e.which==13||e.which==38||e.which==40){e.preventDefault();}else{if(search){search.keyup(e);}}
filter();}
var tagsPaste=function(e){if(e.clipboardData||e.originalEvent.clipboardData){var text=(e.originalEvent||e).clipboardData.getData('text/plain');}else if(window.clipboardData){var text=window.clipboardData.getData('Text');}
var data=extractTags(text);if(typeof(obj.options.onbeforepaste)=='function'){var ret=obj.options.onbeforepaste(el,obj,data);if(ret===false){e.preventDefault();return false;}else{if(ret){data=ret;}}}
if(data.length>1){obj.add(data,true);e.preventDefault();}else if(data[0]){document.execCommand('insertText',false,data[0])
e.preventDefault();}}
var tagsMouseUp=function(e){if(e.target.parentNode&&e.target.parentNode.classList.contains('jtags')){if(e.target.classList.contains('jtags_label')||e.target.classList.contains('jtags_error')){var rect=e.target.getBoundingClientRect();if(rect.width-(e.clientX-rect.left)<16){obj.remove(e.target);}}}
if(e.target==el){setFocus();}}
var tagsFocus=function(){if(!el.classList.contains('jtags-focus')){if(!el.children.length||obj.getValue(el.children.length-1)){if(!limit()){createElement('');}}
if(typeof(obj.options.onfocus)=='function'){obj.options.onfocus(el,obj,obj.getValue());}
el.classList.add('jtags-focus');}}
var tagsBlur=function(){if(el.classList.contains('jtags-focus')){if(search){search.close();}
for(var i=0;i<el.children.length-1;i++){if(!obj.getValue(i)){el.removeChild(el.children[i]);}}
change();el.classList.remove('jtags-focus');if(typeof(obj.options.onblur)=='function'){obj.options.onblur(el,obj,obj.getValue());}}}
var init=function(){if('touchend'in document.documentElement===true){el.addEventListener('touchend',tagsMouseUp);}else{el.addEventListener('mouseup',tagsMouseUp);}
el.addEventListener('keydown',tagsKeyDown);el.addEventListener('keyup',tagsKeyUp);el.addEventListener('paste',tagsPaste);el.addEventListener('focus',tagsFocus);el.addEventListener('blur',tagsBlur);el.setAttribute('contenteditable',true);el.classList.add('jtags');obj.setOptions(options);if(typeof(obj.options.onload)=='function'){obj.options.onload(el,obj);}
el.change=obj.setValue;el.val=function(val){if(val===undefined){return obj.getValue();}else{obj.setValue(val);}}
el.tags=obj;}
init();return obj;});jSuites.toolbar=(function(el,options){var obj={type:'toolbar'};obj.options={};var defaults={app:null,container:false,badge:false,title:false,responsive:false,maxWidth:null,bottom:true,items:[],}
for(var property in defaults){if(options&&options.hasOwnProperty(property)){obj.options[property]=options[property];}else{obj.options[property]=defaults[property];}}
if(!el&&options.app&&options.app.el){el=document.createElement('div');options.app.el.appendChild(el);}
var toolbarArrow=document.createElement('div');toolbarArrow.classList.add('jtoolbar-item');toolbarArrow.classList.add('jtoolbar-arrow');var toolbarFloating=document.createElement('div');toolbarFloating.classList.add('jtoolbar-floating');toolbarArrow.appendChild(toolbarFloating);obj.selectItem=function(element){var elements=toolbarContent.children;for(var i=0;i<elements.length;i++){if(element!=elements[i]){elements[i].classList.remove('jtoolbar-selected');}}
element.classList.add('jtoolbar-selected');}
obj.hide=function(){jSuites.animation.slideBottom(el,0,function(){el.style.display='none';});}
obj.show=function(){el.style.display='';jSuites.animation.slideBottom(el,1);}
obj.get=function(){return el;}
obj.setBadge=function(index,value){toolbarContent.children[index].children[1].firstChild.innerHTML=value;}
obj.destroy=function(){toolbar.remove();el.innerHTML='';}
obj.update=function(a,b){for(var i=0;i<toolbarContent.children.length;i++){var toolbarItem=toolbarContent.children[i];if(typeof(toolbarItem.updateState)=='function'){toolbarItem.updateState(el,obj,toolbarItem,a,b);}}}
obj.create=function(items){toolbarContent.innerHTML='';for(var i=0;i<items.length;i++){var toolbarItem=document.createElement('div');toolbarItem.classList.add('jtoolbar-item');if(items[i].width){toolbarItem.style.width=parseInt(items[i].width)+'px';}
if(items[i].k){toolbarItem.k=items[i].k;}
if(items[i].tooltip){toolbarItem.setAttribute('title',items[i].tooltip);}
if(items[i].id){toolbarItem.setAttribute('id',items[i].id);}
if(items[i].updateState){toolbarItem.updateState=items[i].updateState;}
if(items[i].active){toolbarItem.classList.add('jtoolbar-active');}
if(items[i].type=='select'||items[i].type=='dropdown'){jSuites.picker(toolbarItem,items[i]);}else if(items[i].type=='divisor'){toolbarItem.classList.add('jtoolbar-divisor');}else if(items[i].type=='label'){toolbarItem.classList.add('jtoolbar-label');toolbarItem.innerHTML=items[i].content;}else{var toolbarIcon=document.createElement('i');if(typeof(items[i].class)==='undefined'){toolbarIcon.classList.add('material-icons');}else{var c=items[i].class.split(' ');for(var j=0;j<c.length;j++){toolbarIcon.classList.add(c[j]);}}
toolbarIcon.innerHTML=items[i].content?items[i].content:'';toolbarItem.appendChild(toolbarIcon);if(obj.options.badge==true){var toolbarBadge=document.createElement('div');toolbarBadge.classList.add('jbadge');var toolbarBadgeContent=document.createElement('div');toolbarBadgeContent.innerHTML=items[i].badge?items[i].badge:'';toolbarBadge.appendChild(toolbarBadgeContent);toolbarItem.appendChild(toolbarBadge);}
if(items[i].title){if(obj.options.title==true){var toolbarTitle=document.createElement('span');toolbarTitle.innerHTML=items[i].title;toolbarItem.appendChild(toolbarTitle);}else{toolbarItem.setAttribute('title',items[i].title);}}
if(obj.options.app&&items[i].route){toolbarItem.route=items[i].route;toolbarItem.onclick=function(){obj.options.app.pages(this.route);}
obj.options.app.pages(items[i].route,{toolbarItem:toolbarItem,closed:true});}}
if(items[i].onclick){toolbarItem.onclick=items[i].onclick.bind(items[i],el,obj,toolbarItem);}
toolbarContent.appendChild(toolbarItem);}
setTimeout(function(){obj.refresh();},0);}
obj.open=function(){toolbarArrow.classList.add('jtoolbar-arrow-selected');var rectElement=el.getBoundingClientRect();var rect=toolbarFloating.getBoundingClientRect();if(rect.bottom>window.innerHeight||obj.options.bottom){toolbarFloating.style.bottom='0';}else{toolbarFloating.style.removeProperty('bottom');}
toolbarFloating.style.right='0';toolbarArrow.children[0].focus();jSuites.tracking(obj,true);}
obj.close=function(){toolbarArrow.classList.remove('jtoolbar-arrow-selected')
jSuites.tracking(obj,false);}
obj.refresh=function(){if(obj.options.responsive==true){var rect=el.parentNode.getBoundingClientRect();if(!obj.options.maxWidth){obj.options.maxWidth=rect.width;}
var available=parseInt(obj.options.maxWidth);if(toolbarArrow.parentNode){toolbarArrow.parentNode.removeChild(toolbarArrow);}
while(toolbarFloating.firstChild){toolbarContent.appendChild(toolbarFloating.firstChild);}
if(available<toolbarContent.offsetWidth){available-=50;while(toolbarContent.lastChild&&available<toolbarContent.offsetWidth){toolbarFloating.insertBefore(toolbarContent.lastChild,toolbarFloating.firstChild);}}
if(toolbarFloating.children.length>0){toolbarContent.appendChild(toolbarArrow);}}}
el.onclick=function(e){var element=jSuites.findElement(e.target,'jtoolbar-item');if(element){obj.selectItem(element);}
if(e.target.classList.contains('jtoolbar-arrow')){obj.open();}}
window.addEventListener('resize',function(){obj.refresh();});el.classList.add('jtoolbar');el.innerHTML='';if(obj.options.container==true){el.classList.add('jtoolbar-container');}
var toolbarContent=document.createElement('div');el.appendChild(toolbarContent);if(obj.options.app){el.classList.add('jtoolbar-mobile');}
obj.create(obj.options.items);el.toolbar=obj;return obj;});jSuites.validations=(function(){var isNumeric=function(num){return!isNaN(num)&&num!==null&&num!=='';}
var numberCriterias={'between':function(value,range){return value>=range[0]&&value<=range[1];},'not between':function(value,range){return value<range[0]||value>range[1];},'<':function(value,range){return value<range[0];},'<=':function(value,range){return value<=range[0];},'>':function(value,range){return value>range[0];},'>=':function(value,range){return value>=range[0];},'=':function(value,range){return value===range[0];},'!=':function(value,range){return value!==range[0];},}
var dateCriterias={'valid date':function(){return true;},'=':function(value,range){return value===range[0];},'<':function(value,range){return value<range[0];},'<=':function(value,range){return value<=range[0];},'>':function(value,range){return value>range[0];},'>=':function(value,range){return value>=range[0];},'between':function(value,range){return value>=range[0]&&value<=range[1];},'not between':function(value,range){return value<range[0]||value>range[1];},}
var textCriterias={'contains':function(value,range){return value.includes(range[0]);},'not contains':function(value,range){return!value.includes(range[0]);},'=':function(value,range){return value===range[0];},'valid email':function(value){var pattern=new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);return pattern.test(value);},'valid url':function(value){var pattern=new RegExp(/(((https?:\/\/)|(www\.))[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]+)/ig);return pattern.test(value);},}
var component=function(value,options){if(typeof(component[options.type])==='function'){if(options.allowBlank&&value===''){return true;}
return component[options.type](value,options);}
return null;}
component.url=function(){var pattern=new RegExp(/(((https?:\/\/)|(www\.))[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]+)/ig);return pattern.test(data)?true:false;}
component.email=function(data){var pattern=new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);return data&&pattern.test(data)?true:false;}
component.required=function(data){return data.trim()?true:false;}
component.number=function(data,options){if(!isNumeric(data)){return false;}
if(!options||!options.criteria){return true;}
if(!numberCriterias[options.criteria]){return false;}
var values=options.value.map(function(num){return parseFloat(num);})
return numberCriterias[options.criteria](data,values);};component.login=function(data){var pattern=new RegExp(/^[a-zA-Z0-9\_\-\.\s+]+$/);return data&&pattern.test(data)?true:false;}
component.list=function(data,options){var dataType=typeof data;if(dataType!=='string'&&dataType!=='number'){return false;}
var validOption=options.value[0].split(',').findIndex(function name(item){return item==data;});return validOption>-1;}
component.date=function(data,options){if(new Date(data)=='Invalid Date'){return false;}
if(!options||!options.criteria){return true;}
if(!dateCriterias[options.criteria]){return false;}
var values=options.value.map(function(date){return new Date(date).getTime();});return dateCriterias[options.criteria](new Date(data).getTime(),values);}
component.text=function(data,options){if(typeof data!=='string'){return false;}
if(!options||!options.criteria){return true;}
if(!textCriterias[options.criteria]){return false;}
return textCriterias[options.criteria](data,options.value);}
return component;})();return jSuites;})));