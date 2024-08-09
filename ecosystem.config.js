module.exports = {
    apps: [
        {
            name: "fdh-web:5000",
            script: "node_modules/next/dist/bin/next",
            args: "start -p 5000", //running on port 3000
            watch: false,
        },
    ],
};