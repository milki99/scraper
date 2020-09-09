const { Scraper, Root, DownloadContent, OpenLinks, CollectContent } = require('nodejs-web-scraper');
const fs = require('fs');

(async () => {

    const config = {
        baseSiteUrl: `https://www.nytimes.com/`,
        startUrl: `https://www.nytimes.com/section/business`,
        filePath: './images/',
        concurrency: 1,//Maximum concurrent jobs. More than 10 is not recommended.Default is 3.
        maxRetries: 3,//The scraper will try to repeat a failed request few times(excluding 404). Default is 5.       
        cloneImages: false,
        logPath: './logs/'//Highly recommended: Creates a friendly JSON for each operation object, with all the relevant data. 
    }

    const articles = [];//Holds all article objects.

    const getPageObject = async (pageObject) => {//This will create an object for each page, with "title", "story" and "image" properties(The names we chose for our scraping operations below)

        //Every hook supports async operations
        await Promise.resolve()//Just demonstrating..

        articles.push(pageObject)
    }

    const scraper = new Scraper(config);//Create a new Scraper instance, and pass config to it.

    //Now we create the "operations" we need:

    const root = new Root();//The root object fetches the startUrl, and starts the process.  

    //Any valid cheerio-advanced-selectors selector can be passed. For further reference: https://cheerio.js.org/
    //const category = new OpenLinks('.css-1wjnrbv', { name: 'category' });//Opens each category page.

    const article = new OpenLinks('article a', { name: 'article', getPageObject });//Opens each article page, and calls the getPageObject hook.
    const image = new DownloadContent('img', { name: 'image' });//Downloads images. *It's important to choose a name, for the
    //getPageObject hook to produce the expected results.*  

    const title = new CollectContent('h1', { name: 'title' });//"Collects" the text from each H1 element.

    const story = new CollectContent('section.meteredContent', { name: 'story' });//"Collects" the the article body.

    root.addOperation(article);//Then we create a scraping "tree":
    //category.addOperation(article);
    article.addOperation(image);
    article.addOperation(title);
    article.addOperation(story);

    await scraper.scrape(root);

    fs.writeFile('./articles.json', JSON.stringify(articles), () => { })//Will produce a formatted JSON containing all article pages and their selected data.

})();
