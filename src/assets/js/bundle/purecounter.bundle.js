function setOptions(config,baseConfig={}){var newConfig={};for(var key in config){if(baseConfig!={}&&!baseConfig.hasOwnProperty(key))continue;var val=parseValue(config[key]);newConfig[key]=val;if(key.match(/duration|pulse/)){newConfig[key]=typeof val!="boolean"?val*1000:val;}}
return Object.assign({},baseConfig,newConfig);}
function startCounter(element,config){var incrementsPerStep=(config.end-config.start)/(config.duration/config.delay);var countMode="inc";if(config.start>config.end){countMode="dec";incrementsPerStep*=-1;}
var currentCount=parseValue(config.start);element.innerHTML=formatNumber(currentCount,config);if(config.once===true){element.setAttribute("data-purecounter-duration",0);}
var counterWorker=setInterval(()=>{var nextNum=nextNumber(currentCount,incrementsPerStep,countMode);element.innerHTML=formatNumber(nextNum,config);currentCount=nextNum;if((currentCount>=config.end&&countMode=="inc")||(currentCount<=config.end&&countMode=="dec")){element.innerHTML=formatNumber(config.end,config);if(config.pulse){element.setAttribute("data-purecounter-duration",0);setTimeout(()=>{element.setAttribute("data-purecounter-duration",config.duration/1000);},config.pulse);}
clearInterval(counterWorker);}},config.delay);}
function nextNumber(number,steps,mode="inc"){number=parseValue(number);steps=parseValue(steps);return parseFloat(mode==="inc"?number+steps:number-steps);}
function convertNumber(number,config){if(config.filesizing||config.currency){number=Math.abs(Number(number));var baseNumber=1000,symbol=config.currency&&typeof config.currency==="string"?config.currency:"",limit=config.decimals||1,unit=["","K","M","B","T"],value="";if(config.filesizing){baseNumber=1024;unit=["bytes","KB","MB","GB","TB"];}
for(var i=4;i>=0;i--){if(i===0)value=`${number.toFixed(limit)} ${unit[i]}`;if(number>=getFilesizeThreshold(baseNumber,i)){value=`${(number/getFilesizeThreshold(baseNumber,i)).toFixed(limit)} ${unit[i]}`;break;}}
return symbol+value;}else{return parseFloat(number);}}
function getFilesizeThreshold(baseNumber,index){return Math.pow(baseNumber,index);}
function applySeparator(value,config){function replacedValue(val,separator){var separatorRegExp=/^(?:(\d{1,3},(?:\d{1,3},?)*)|(\d{1,3}\.(?:\d{1,3}\.?)*)|(\d{1,3}(?:\s\d{1,3})*))([\.,]?\d{0,2}?)$/gi;return val.replace(separatorRegExp,function(match,g1,g2,g3,g4){var result="",sep="";if(g1!==undefined){result=g1.replace(new RegExp(/,/gi,"gi"),separator);sep=",";}else if(g2!==undefined){result=g2.replace(new RegExp(/\./gi,"gi"),separator);}else if(g3!==undefined){result=g3.replace(new RegExp(/ /gi,"gi"),separator);}
if(g4!==undefined){var decimal=sep!==","?(separator!==","?",":"."):".";result+=g4!==undefined?g4.replace(new RegExp(/\.|,/gi,"gi"),decimal):"";}
return result;});}
if(config.formater){var symbol=config.separator?typeof config.separator==="string"?config.separator:",":"";if(config.formater!=="en-US"&&config.separator===true){return value;}
return replacedValue(value,symbol);}
return value;}
function formatNumber(number,config){var strConfig={minimumFractionDigits:config.decimals,maximumFractionDigits:config.decimals,};var locale=typeof config.formater==="string"?config.formater:undefined;number=convertNumber(number,config);number=config.formater?number.toLocaleString(locale,strConfig):parseInt(number).toString();return applySeparator(number,config);}
function parseValue(data){if(/^[0-9]+\.[0-9]+$/.test(data)){return parseFloat(data);}
if(/^[0-9]+$/.test(data)){return parseInt(data);}
if(/^true|false/i.test(data)){return /^true/i.test(data);}
return data;}
function elementIsInView(element){var top=element.offsetTop;var left=element.offsetLeft;var width=element.offsetWidth;var height=element.offsetHeight;while(element.offsetParent){element=element.offsetParent;top+=element.offsetTop;left+=element.offsetLeft;}
return(top>=window.pageYOffset&&left>=window.pageXOffset&&top+height<=window.pageYOffset+window.innerHeight&&left+width<=window.pageXOffset+window.innerWidth);}
function intersectionListenerSupported(){return("IntersectionObserver"in window&&"IntersectionObserverEntry"in window&&"intersectionRatio"in window.IntersectionObserverEntry.prototype);}
function PureCounter(options={}){var configs={start:0,end:100,duration:2000,delay:10,once:true,pulse:false,decimals:0,legacy:true,filesizing:false,currency:false,separator:false,formater:"us-US",selector:".purecounter",};var configOptions=setOptions(options,configs);function registerEventListeners(){var elements=document.querySelectorAll(configOptions.selector);if(elements.length===0){return;}
if(intersectionListenerSupported()){var intersectObserver=new IntersectionObserver(animateElements.bind(this),{root:null,rootMargin:"20px",threshold:0.5,});elements.forEach((element)=>{intersectObserver.observe(element);});}else{if(window.addEventListener){animateLegacy(elements);window.addEventListener("scroll",function(e){animateLegacy(elements);},{passive:true});}}}
function animateLegacy(elements){elements.forEach((element)=>{var config=parseConfig(element);if(config.legacy===true&&elementIsInView(element)){animateElements([element]);}});}
function animateElements(elements,observer){elements.forEach((element)=>{var elm=element.target||element;var elementConfig=parseConfig(elm);if(elementConfig.duration<=0){return(elm.innerHTML=formatNumber(elementConfig.end,elementConfig));}
if((!observer&&!elementIsInView(element))||(observer&&element.intersectionRatio<0.5)){var value=elementConfig.start>elementConfig.end?elementConfig.end:elementConfig.start;return(elm.innerHTML=formatNumber(value,elementConfig));}
setTimeout(()=>{return startCounter(elm,elementConfig);},elementConfig.delay);});}
function parseConfig(element){var baseConfig=configOptions;var configValues=[].filter.call(element.attributes,function(attr){return /^data-purecounter-/.test(attr.name);});var elementConfig=configValues.length!=0?Object.assign({},...configValues.map(({name,value})=>{var key=name.replace("data-purecounter-","").toLowerCase(),val=parseValue(value);return{[key]:val};})):{};return setOptions(elementConfig,baseConfig);}
registerEventListeners();}
module.exports=PureCounter;