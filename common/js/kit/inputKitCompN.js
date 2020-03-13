//inputKit

/*
여러 답이 존재할경우 '|' (or문자) 로 구분하여 적음
예를들어 답이 'a' 이거나 'b' 인경우
----------------check(정답배열, 사용자입력답배열, [판단옵션])----------------
check(['입력답'], ['a|b']);
- 범위 기능은 정답이 다음과 같다면 1~100 사이의 값을 입력하면 정답으로 판단.
check(['입력답'], ['F[range, 1~100']);
- 분모분자 기능의 경우는 만약 정답이 다음과 같다면, 입력답이 1/3 이어도 정답이 된다. 1/3 == 3/9
check(['입력답'], ['F[numerator, 0, 3']);
check(['입력답'], ['F[denominator, 0, 9']);
*/

var inputKitComp = (function(){
	if(!String.prototype.trim){
		String.prototype.trim = function(){
			return this.replace(/(^\s*)|(\s*$)/g,"");
		};
	}
	
	if(!String.prototype.trimAll){
		String.prototype.trimAll = function(){
			return this.replace(/\s/g,"");
		};
	}
	
	if(!String.prototype.replaceAll){
		String.prototype.replaceAll = function(text,replaceText){
			return this.split(text).join(replaceText);
		}
	}
	
	return{
		check: function(answerArr, userAnswerArr, options){
			options = options || {};
			this.options = {
				//대소문자 판단 무시할 인덱스를 적음
				//Can ignore case : board index
				//ex) "0,1" 
				freeCaseJudge: 				"",
				
				//공백문자를 판단하지 않을 답의 인덱스 번호를 적음
				//Ignore blank : board index
				//ex) "0,1" 
				freeSpaceJudge: 			"",
				
				//입력순서 판단하지 않을 답의 인덱스 번호를 적음
				//(즉, 답을 서로 교환 가능하도록 할 대상들을 명시)
				//Interchangeable answers : board index
				//ex) ["0,1", "2,3,4"] // 0 and 1 can be exchanged, 2 and 3 and 4 can be exchanged  //0,1 그리고 2,3,4는 답을 바꿔적어도 정답 판단이 됨.
				freeOrderJudge: 		[],//
				
				//그룹단위의 입력순서를 판단하지 않을 답의 인덱스 번호를 적음
				//group Interchangeable answers : board index
				//ex) [["0,1", "2,3"], ["4,5", "6,7"]]   // [0,1] and [2,3] can be exchanged,  [4,5] and [6,7] can be exchanged.
				//ex) [["0,1,2", "4,5,6"]]               // [0,1,2] and [3,4,5] can be exchanged
				freeGroupOrderJudge: 	[[]]
				
			};
			
			for(var o in options) this.options[o] = options[o];
			
			answerArr = this.jfilter(answerArr.join('¶')).split('¶');
			
			//console.log(answerArr, userAnswerArr);
			var i,j,len,chk;
			var v = answerArr;
			var k = [];
			var myAnswer = userAnswerArr;
			
			///////함수조건으로 판단할 요소들 배열에서 분리
			var comArr = [];
			var valArr = [];
			
			len = v.length;
			
			if(v.join("") == ""){
				chk = false;
			}else{
				j=0;
				for(i=0; i<len; i++) k[i] = i;
				for(i=0; i<len; i++){
					//명령조건이면
					if(v[j].substr(0,2) == "F["){
						
						//다른 배열로 옮기고, 내용을 추출
						comArr.push(v[j].substring(v[j].indexOf("[")+1, v[j].lastIndexOf("]")));
						valArr.push(myAnswer[j]);
						v.splice(j,1);
						k.splice(j,1);
						myAnswer.splice(j,1);
					}else j++;
				}
				
				//문제답이 여러개일경우 경우의수만큼 문제를 풀어 처리
				/*
				한필드에 여러개의 답이 존재할경우, 계산할 답리스트를 풀어주자
				정답스트링이 a|b,c|d>>txt1,txt2 일경우
				txt1필드에는 a나 b가 들어오고 txt2에는 c나 d가 들어오면 정답으로 처리해주기위해
				a|b,c|d 의 식을 풀어서 리스트로 다시 만들어 전부 검사를 진행도록,,
				
				a|b,c|d를
				
				a,c
				a,d
				b,c
				b,d
				처럼 리스트를 만들고 전부 검사하여 이중에 하나라도 정답이면 답.
				*/
				var resultArr = this.getAnswerList(v);
				//console.log(answerArr, userAnswerArr);
				//console.log(resultArr);
				for(var f in resultArr){	
					chk = this.checkByOption(resultArr[f], myAnswer, k);
					if(chk) break;
				}
				chk = chk && this.checkByFunction(comArr, valArr);
			}
			return chk;
		},
	
	//여러 답 판단이 필요한 답배열을 낱개로 풀어준다.
	//ex) ['a', 'b|c']
	//--> ['a', 'b']
	//--> ['a', 'c']
		getAnswerList:function (arr){
			//console.log(arr);
			var list = [];
			var result = [];
			var j,k,i,len = 1;
			var cb=[];//각필드에 해당하는 여러답의 인덱스
			var ca=[];//각필드의 여러답 수
			//필드수가 되겠음
			
			var pcount = arr.length;
			
			for(i=0; i<pcount; i++){
				list[i] = arr[i].split("|");
				//각 입력필드에 해당하는 여러답의 수가 되겠음.
				ca[i] = list[i].length;
				//총 경우의 수
				len *= list[i].length;
			}
			//console.log("list",list);
			//console.log("len",len);
			var cbn;
			for(i=0; i<len; i++){
				var tarr = [];
				for(j=0; j<pcount; j++){
					cb[j] = (cb[j] == undefined || isNaN(cb[j])) ? 0 : cb[j];
					//console.log("-",cb[j],cbn);
					tarr.push(list[j][cb[j]%ca[j]]);
					//alert(cbn + " % " + cbn + " = " + (cbn%ca[j]))
					//alert(list[j][cbn%ca[j]]);
					//마지막 필드번째마다 인덱스를 증가
					if(j == pcount-1){
						//trace(cb, ca);
						//인덱스증가
						cb[j]++;
						//각 필드의 여러답수를 진수로 여기고 끝필드(끝배열)부터 증가해서, 올림값이 생기면 앞배열도 증가시킴
						/*
						예를 들어 2개필드가 있고 각 필드에 각각 3가지,2가지 경우의 답이 있다고 가정하면
						각각 3진수 2진수 수의 개념을 잡고, 끝배열(1의 자리라 생각하자)부터 1씩 증가시킨다
						0 0
						0 1
						1 0
						1 1
						2 0
						2 1
						*/
						for(k=j; k>0; k--){
							if(cb[k]>0 && cb[k]%ca[k] == 0){
								cb[k-1] = Math.floor(cb[k]/ca[k]);
							}
						}
					}
				}
				//console.log(tarr);
				result[i] = tarr;
			}
			//alert(result);
			//console.log(JSON.stringify(arr));
			//console.log(JSON.stringify(result));
			
			return result;
		},
	
		//겹자음 분리필터
		jlist : {
			"ㅄ":"ㅂㅅ",
			"ㄳ":"ㄱㅅ",
			"ㄶ":"ㄴㅎ",
			"ㄵ":"ㄴㅈ",
			"ㅀ":"ㄹㅎ",
			"ㄾ":"ㄹㅌ",
			"ㄺ":"ㄹㄱ",
			"ㄽ":"ㄹㅅ",
			"ㄻ":"ㄹㅁ",
			"ㄿ":"ㄹㅍ",
			"ㄼ":"ㄹㅂ"
		},
	
		//한글의 겹자음을 분리하는 필터. 정확한 판단을 위해
		jfilter: function (str){
			//console.log("---겹자음필터 문자열:",str);
			//var str = "ㄼㅁ|ㅁㄼ|ㅂㅁㄹ<<txt1";
			var reg = new RegExp("ㅄ|ㄳ|ㄶ|ㄵ|ㅀ|ㄾ|ㄺ|ㄽ|ㄻ|ㄿ|ㄼ","g");
			var matchList = str.match(reg);
			var i;
			var tempStr;
			var s;
			
			if(matchList){
				matchList.sort();
				
				for(i=0; i<matchList.length; i++){
					s = matchList[i];
					if(tempStr == s) continue;//중복동작 방지
					str = str.replace(new RegExp(s, "g"), jlist[s]);
					tempStr = s;
				}
			}
			//console.log("---겹자음필터 결과:",str);
			return str;
		},
	
		//정답이 F[] 기능일 경우 판단로직
		checkByFunction:function (comArr, valArr){
			var len = comArr.length;
			var chk = true;
			
			var first_bunsu = [];
			var i,index,tempNum1,tempNum2;
			var tempArr1 = [];
			for(i=0; i<len; i++){
				var arg = comArr[i].split(',');
				if(valArr[i] == undefined || valArr[i] == "" || valArr[i] == null) return false;
				switch(arg[0]){
					//case "분자":
					case "numerator":
					//case "분모":
					case "denominator":
						//인자 2 : index, number
						index = parseInt(arg[1], 10);
						
						if(first_bunsu[index] == undefined){
							first_bunsu[index] = {};
						}
						
						if(arg[0] == "numerator"){
							first_bunsu[index].bunja_g = (parseInt(valArr[i], 10) / parseInt(arg[2], 10)).toFixed(5);
						}else{
							first_bunsu[index].bunmo_g = (parseInt(valArr[i], 10) / parseInt(arg[2], 10)).toFixed(5);
						}
						//분자,분모가 다 모였을때
						if(first_bunsu[index].bunja_g != undefined && first_bunsu[index].bunmo_g != undefined){
							if(first_bunsu[index].bunja_g != first_bunsu[index].bunmo_g) return false;
						}
					break;
					
					//case "범위":
					case "range":
						//인자 1 : number~number
						tempArr1 = arg[1].split('~');
						tempNum1 = parseFloat(valArr[i]);
						if(tempNum1 < parseFloat(tempArr1[0]) || tempNum1 > parseFloat(tempArr1[1])) return false;
					break;
					
					//....add function
				}
			}
			
			if(first_bunsu[index] != undefined){
				//분자나 분모중 하나라도 비면,,, 오답처리
				if(first_bunsu[index].bunja_g == undefined || first_bunsu[index].bunmo_g == undefined) return false;
			}
			return chk;
		},
	
		//정답이 일반 문자열(+옵션)인경우 처리. 
		checkByOption:function (answer, myAnswer, fn){
			var i,j,len,dipName,_name,_sortA,_sortB,o,tempA,tempB;
			var chk = true;
			
			//필드인덱스정보
			var fi_a = {};
			var fi_b = {};
			
			var sort1 = function(a,b){
				if(a.v > b.v) return 1;
				else return -1;
			}
			var sort2 = function(a,b){
				if(join(a) > join(b)) return 1;
				else return -1;
			}
			var join = function(arr){
				var str = "";
				for(var p in arr){
					str += arr[p].v;
				}
				return str;
			}
			
			//fn : 필드이름들 -> ["txt1","txt2"]
			//s  : 인덱스 정수
			
			/*
			필드인덱스정보배열 fi_b와 fi_a를 똑같이 초기화.
			ex)
			fi_b["txt1"] = fi_a["txt1"] = 0
			fi_b["txt2"] = fi_a["txt2"] = 1
			*/
			
			
			for(var s in fn) fi_b[fn[s]] = fi_a[fn[s]] = s;
			
			//정오답체크
			len = answer.length;
			
			if(myAnswer.length != len){
				chk = false;
			}else{
				//준비
				/*
				"txt1,txt2"의 구조에 ","를 붙여서 검색하기 위함,
				이유는, "txt10,txt1"에서 "txt1"이 포함되나 검색하면 두가지경우 모두 포함되기 때문에.
				*/
				this.options.freeCaseJudge += ",";
				this.options.freeSpaceJudge += ",";
				
				for(i=0; i<len; i++){
					dipName = fn[i];
					//대소문자처리
					//alert(this.options.freeCaseJudge + "," +dipName);
					if(this.options.freeCaseJudge.indexOf(dipName+",") == -1){
						answer[i] = answer[i].toLowerCase();
						myAnswer[i] = myAnswer[i].toLowerCase();
					}
					//공백처리
					if(this.options.freeSpaceJudge.indexOf(dipName+",") == -1){
						//answer[i] = this.Trim(answer[i]);
						//myAnswer[i] = this.Trim(myAnswer[i]);
						answer[i] = answer[i].trimAll();
						myAnswer[i] = myAnswer[i].trimAll();
					}
				}
				
				//입력순서상관없음필드 = [];//1차원배열
				//입력순서상관없음필드조건대로 필드인덱스배열을 정렬(fi)
				for(i=0; i<this.options.freeOrderJudge.length; i++){
					//"txt1,txt2"형식에서 배열로 나눔
					_name = this.options.freeOrderJudge[i].split(',');
					
					_sortA = [];
					_sortB = [];
					//1. 현재필드이름(입력순서상관없음에해당하는)을 인덱스로하여 fi에서 해당 답과, 인덱스번호 가져다 새 배열을 만든다.
					for(o in _name){
						_sortA.push({v:answer[fi_a[_name[o]]], idx:fi_a[_name[o]]});
						_sortB.push({v:myAnswer[fi_b[_name[o]]], idx:fi_b[_name[o]]});
					}
					//2. 그 배열을 답(v)을 기준으로 정렬한다.
					_sortA.sort(sort1);
					_sortB.sort(sort1);
					//3. 정렬된 순서를 필드인덱스배열(fi)에 적용한다.
					for(o in _name){
						fi_a[_name[o]] = _sortA[o].idx;
						fi_b[_name[o]] = _sortB[o].idx;
					}
				}
				
				//그룹순서상관없음필드조건대로 필드인덱스배열을 추가정렬
				//그룹순서상관없음필드 = [[]];//2차원 배열
				
				//ex) [["txt1,txt2","txt3,txt4"]]
				for(i=0; i<this.options.freeGroupOrderJudge.length; i++){
					_sortA = [];
					_sortB = [];
					//ex) ["txt1,txt2","txt3,txt4"]
					for(j=0; j<this.options.freeGroupOrderJudge[i].length; j++){
						_name = this.options.freeGroupOrderJudge[i][j].split(',');
						
						tempA = [];
						tempB = [];
						//ex) "txt1,txt2"
						//1. 그룹순서 상관없음의 기본배열을 구성한다(위와같음) (그룹으로잡기위해)
						for(o in _name){
							tempA.push({v:answer[fi_a[_name[o]]], idx:fi_a[_name[o]]});
							tempB.push({v:myAnswer[fi_b[_name[o]]], idx:fi_b[_name[o]]});
						}
						//2. 만들어진 배열을 인자로 삼는 배열을 구성한다.
						_sortA.push(tempA);
						_sortB.push(tempB);
					}
					//3. 인자값의 답스트링을 붙여서, 비교하여 정렬한다 : _sortA[n] 배열을 돌면서 자식배열의v값을 합친 스트링으로 정렬
					//개념은.. 그룹순서상관없음이기때문에. 그룹잡은 정보를 직렬화하여 그것을 정렬하는방식으로 '그룹'과 '순서상관없다'는 것을 해결 하는것.
					_sortA.sort(sort2);
					_sortB.sort(sort2);
					
					//4. 정렬된 순서를 필드인덱스배열(fi)에 적용.
					for(j=0; j<this.options.freeGroupOrderJudge[i].length; j++){
						_name = this.options.freeGroupOrderJudge[i][j].split(',');
						for(o in _name){
							fi_a[_name[o]] = _sortA[j][o].idx
							fi_b[_name[o]] = _sortB[j][o].idx
						}
					}
				}
				
				//판단
				//하나라도 다른게있다면 오답!
				for(i=0; i<len; i++){
					if(answer[fi_a[fn[i]]] != myAnswer[fi_b[fn[i]]]){
						chk = false;
						break;
					}
				}
			}
			
			return chk;
		}
	}
})();