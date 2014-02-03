'use strict';

(function(){
	window.Talk = angular.module('talkangular', []);

	Talk.controller('talk.IndexCtrl', [
		'$scope',
		function($scope){
		}
		]);

	Talk.directive('talkExample', [
		function(){
			var dedent = function(text){
				var lines = text.split('\n');
				var indentLevel = Infinity;
				_.forEach(lines, function(line){
					var match = /^(\s*)(.*)$/.exec(line);
					if(!match[2]){
						return;
					}

					if(match[1].length < indentLevel){
						indentLevel = match[1].length;
					}
				});

				if(indentLevel == Infinity){
					return text;
				}

				var makeIndent = function(i){
					if(i <= 0){
						return'';
					}
					return _.map(_.range(i), function(){ return ' '; }).join('');
				};

				var newLines = _.map(lines, function(line){
					var match = /^(\s*)(.*)$/.exec(line);
					var newLine = '';
					if(match[1].length){
						newLine = makeIndent(match[1].length - indentLevel) + match[2];
					}
					return newLine;
				});
				if(!newLines[0]){
					newLines = _.rest(newLines);
				}
				return newLines.join('\n');
			};

			return {
				restrict: 'A',
				link: function(scope, element, attrs){
					var $pre = $('<pre></pre>');
					$pre.addClass('prettyprint');
					if(attrs.type === 'text/ng-template'){
						$pre.addClass('lang-html');
					}
					$pre.addClass(element[0].className);

					$pre.text(dedent(element.text()));
					element.after($pre);
					prettyPrint(element.parent()[0]);
				}
			};
		}
		]);

Talk.directive('talkSlides', [
	function(){
		return {
			restrict: 'A',
			link: function(scope, element, attrs){
				element.addClass('slides');

				if(!window.Reveal){
					return;
				}
				window.Reveal.initialize({
					controls: true,
					progress: true,
					history: true,
					center: true,

					transition: 'linear'
				});
			}
		}
	}
	]);

Talk.config([
	'$interpolateProvider',
	function($interpolateProvider){
		$interpolateProvider.startSymbol('[[');
		$interpolateProvider.endSymbol(']]');
	}
	]);
})();