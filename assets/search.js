/* 
This file with contain seatch functionality for Dawn theme 
Content: searchObj
*/

let searchObj = {
    init(){
        this.addEvents();
    },
    search(event){
        const userInput = event.target.value;
        fetch("/search/suggest.json?q="+userInput+"&resources[type]=product")
        .then(response => response.json())
        .then(suggestions => {
            const products = suggestions.resources.results.products;
            if(products.length < 1){
                //alert('No products');

            }else{
                // Render results
                let resultsContainer = document.querySelector('.search-modal__results');
             
                let resultsContent = "";
                products.forEach(function(product){

                    let html="";

                    console.log(product);

                    html += "<a href="+product.url+" class='search-modal__line-item'>";

                    html += "<div class='search-modal__line-detail'>";
                    html += product.title;
                    html += "</div>";
                    
                    if(product.price_min < product.price_max){
                        html += "<div class='search-modal__line-detail'>";
                        html += "From: $"+price_min;
                        html += "</div>";
                    }else{
                        html += "<div class='search-modal__line-detail'>";
                        html += "$"+product.price;
                        html += "</div>";
                    }

                    html += "</a>";
                    
                    resultsContent += html

                });
                
                resultsContainer.innerHTML = resultsContent;

            }
        })
    },
    addEvents(){
        const inputs = document.querySelectorAll('.search__input.field__input');
        inputs.forEach(function(input){
            input.onkeyup = searchObj.search
        });
    }
}

function readySearch(callback) {
    if (document.readyState != 'loading') callback();
    else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
}
readySearch(function () {
    searchObj.init();
});