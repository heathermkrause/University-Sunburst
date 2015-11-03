# University-Sunburst

## Prerequisites

You must have node.js and its package manager (npm) installed. You can get them from http://nodejs.org/.

## Running in development mode

If you want to start a component in development mode, simply do

```
npm start
```
Then you can access it at http://localhost:8081

## Creating distribution

To create distribution package, do

```
npm run dist
```

Distribution file will be located in /dist/ folder:
chart.js

To use it in production, simply add following HTML to the page:

```
<script src="dist/chart.js"></script>
<script>datassist.initSunburst(document.getElementById('ID_OF_YOUR_DESIRED_ELEMENT'));</script>
```


