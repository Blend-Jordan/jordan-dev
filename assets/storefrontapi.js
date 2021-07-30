const token = '9bc5cda8cc55cbc93745c1f0d8b0c932';


let test = {
  init(){
      this.test1();
  },
  test1(){
      const query = `query getCollection($first: Int!) {
          collections(first: $first) {
            edges {
              node {
                title
                handle
              }
            }
          }
        }`;
      const body = {
          query: query,
          variables: { first: 1 }
      }
      fetch(`https://jordan-blend.myshopify.com/api/graphql.json`, this.options(body))
      .then(response => response.json())
      .then(response => {
          this.renderCollection(response);
      });

      const query2 = `query singleCollection($handle: String!) {
        collectionByHandle(handle: $handle) {  
          products(first: 10) {
            edges {
              node {
                id
                title
                handle
                images(first:10) {
                   edges {
                      node {
                        originalSrc
                        id
                      }
                   }
                } 
                totalInventory
                priceRange {
                  minVariantPrice {
                    amount
                  }
                  maxVariantPrice {
                    amount
                  }
                }
              }
            }
          }
        }
      }`;
      const body2 = {
        query: query2,
        variables: { handle: "t-shirts" }
      }
      fetch(`https://jordan-blend.myshopify.com/api/graphql.json`, this.options(body2))
      .then(response => response.json())
      .then(response => {
          this.renderProducts(response);
      });
  },
  options(body){
      return {
          method: 'post',
          headers: {
              "Content-Type": "application/json",
              "X-Shopify-Storefront-Access-Token": token
          },
          body: JSON.stringify(body)
      }
  },
  options(body2){
    return {
        method: 'post',
        headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": token
        },
        body: JSON.stringify(body2)
    }
  },
  renderCollection(response){
    const collection = response.data.collections.edges[0].node;
    const collectionContainer = document.querySelector('.specific-collection');

    let html="";
    html += "<div class='specific-collection__item'>";
    html += "<h1>"+collection.title+"</h1>";
    html += "</div>";

    collectionContainer.innerHTML = html;

  },
  renderProducts(response){

    const products = response.data.collectionByHandle.products.edges;

    console.log(products);

    const resultsContainer = document.querySelector('.specific-collection__products');
    let resultsContent = "";

    products.forEach(function(product){

      let html = "";

      html += "<div class='product'>";
      html += "<img src='"+product.node.images.edges[0].node.originalSrc+"'>";
      html += "<h2>"+product.node.title+"</h2>";

      if(product.node.priceRange.minVariantPrice.amount == product.node.priceRange.maxVariantPrice.amount){
        html += "<span class='price'>$"+parseFloat(product.node.priceRange.minVariantPrice.amount).toFixed(2)+"</span>";
      }else{
        html += "<span class='price'>From $"+parseFloat(product.node.priceRange.minVariantPrice.amount).toFixed(2)+"</span>";
      }

      if(product.node.totalInventory == 0){
        html += "<a class='button sold-out' href='https://jordan-blend.myshopify.com/products/"+product.node.handle+"'>Sold out</a>";
      }else{
        html += "<a class='button' href='https://jordan-blend.myshopify.com/products/"+product.node.handle+"'>Buy Now</a>";
      }

      html += "</div>";

      resultsContent += html

    });

    resultsContainer.innerHTML = resultsContent;

  }
}
test.init();


