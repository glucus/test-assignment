'use strict';

    // Angular - модуль, контролирующий работу приложения (через ng-app директиву в index.html)
    // в [] прописаны зависимости от внешних модулей

angular.module('testAssignment', ['chart.js', 'ngResource']) 

    // charts.js - для графиков (http://jtblin.github.io/angular-chart.js/)
    // ngResourse - для связи с json-сервером (https://docs.angularjs.org/api/ngResource)



    // Сервис, получающий данные с json-сервера с помощью $resource

    .service('dataFactory', ['$resource', function ($resource) { 
       
       this.getData = function() {
            return $resource ('http://localhost:3000/data');
        };   
        
    }])


   // Основной контроллер, данные получает из dataFactory

    .controller('InputController', ['$scope', 'dataFactory', function ($scope,  dataFactory) {
       
        
            // для блокировки  некорректного отображения графика, пока данные не получены
        
        $scope.showChart = false;
        $scope.message = 'Loading...';
        
        
        
            // $scope.data получает данные из dataFactory
            // query() в $resource это встроенный тип запроса GET для данных в формате array.
        
        $scope.data = dataFactory.getData().query(    // promise
            
            // функция, которая зависит от response сервера и определяет действия в случае если данные с него дошли 
            
                function(response) {
                    $scope.data = response;
                    $scope.showChart = true;
                },
            
            // функция, которая зависит от response сервера и определяет действия в случае если данные с него не дошли 

                function(response) {
                    $scope.message = "Connection error";
                    console.log($scope.message);
                });
            
          
        
        // функция, суммирующая значения для заданного свойства
        // за счет замыкания внешняя функция имеет доступ к результату работы loop'а внутренней 
       
        $scope.sumVal = function(i) {
            
                var valNum = "val" + i;
                var result = 0;

                function innerfunction() { 
                    
                   // перебор по наблюдениям в массиве с данными 
                    for (var element of $scope.data) {
                        result = result + parseFloat(element[valNum]);
                    } 
                }
                innerfunction();
                return result;  
        } 
        
        // sumVal() вызывается из view, что обеспечивает пересчет с учетом скорректированных значений данных
        
    }])



        // дополнительный контроллер (для графика)
        // в DOM он прикреплен к более дочернему элементу относительно InputController'а  -->  имеет доступ к $scope и функциям InputController'а

    .controller('ChartController', ['$scope', function ($scope) {
        
        // какие столбцы отображать на графике
           $scope.series = ['val1', 'val2', 'val3'];

        
        // функция, возвращающая для заданного свойства массив значений (в числовом формате)
        // используется для получения массивов значений для свойств val1, val2, val3
        
        $scope.formArray = function(propertyName) {
            
            var chartArray = [];
            
            function innerFunction() {
                for (var element of $scope.data) {
                    chartArray.push(parseFloat(element[propertyName]));
                }
            }
            innerFunction();
            return chartArray;
        }
        
        // formArray() также вызывается из view, за счет чего на графике отображаются значения с учетом корректировки 
        
        
        
        // функция, аналогичная formArray(), но без parseFloat - для получения массива значений для свойства без переведения их в числовой формат
        // используеся для получения массива с именами наблюдений        

        
        $scope.formNamesArray = function(propertyName) {
            
            var namesArray = [];
            
            function innerFunction() {
                for (var element of $scope.data) {
                        namesArray.push(element[propertyName]);
                }
            }
            innerFunction();
            return namesArray;
            
        }
                 
            // formNamesArray() вызывается в контроллере, если она вызывает из view получается бесконечный пересчет 
            $scope.labels = $scope.formNamesArray('name');
        
    }]); 
           


