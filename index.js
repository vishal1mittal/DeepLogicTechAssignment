const http = require("http");
const https = require("https");

const server = http.createServer(async (req, res) => {
    if (req.url == "/getTimeStories") {
        try {
            const text = await new Promise((resolve, reject) => {
                https
                    .get("https://time.com", (conn) => {
                        let data = "";
                        conn.on("data", (chunk) => (data += chunk));
                        conn.on("end", () => resolve(data));
                    })
                    .on("error", reject);
            });

            var newsList = [];
            var matches = text.match(/<article[\s\S]*?<\/article>/gi);
            var count = 0;
            for (var block of matches) {
                if (count >= 6) {
                    break;
                }

                let news = block.match(
                    /<a[^>]*href="([^"]+)"[^>]*>\s*<span[^>]*>(.*?)<\/span>/i
                );

                if (news) {
                    var link = news[1];
                    var title = news[2];
                }

                newsList.push({ title, link });
                count += 1;
            }
            res.end(JSON.stringify(newsList, null, 2));
        } catch (error) {
            console.log(error);
            res.end(JSON.stringify({ Error: "Failed to find page" }));
        }
    } else {
        res.end(JSON.stringify({ Error: "Wrong Endpoint" }));
    }
});

server.listen(process.env.PORT || 3000);
console.log("Server Running at port 3000");
