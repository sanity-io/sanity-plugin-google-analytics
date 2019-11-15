# Sanity Google Analytics Plugin

Dashboard widget for showing Anlytics data in your studio

```
sanity install google-analytics
```


## How to config

Add a `google-analytics-plugin.json` in your `config` folder.
You need to retrive your `client_id` from your Google API. [Instructions for setup Google Analytics API](https://github.com/google/google-api-javascript-client/blob/master/docs/start.md#setup)
Your view `id` are available inside your  Google Analytics settings.

```json
{
  "clientId": "XXXXXXXXXX-xxxxxxxxxxxxxx.apps.googleusercontent.com",
  "views": "ga:xxxxxxxx"
}
```

You have to setup a google API, and all your studio users need to have access to the current Google Analytics View

[Query reference](https://developers.google.com/analytics/devguides/reporting/core/v3/reference#q_summary)

Make a config file, and add the path yo your `sanity.json`
```json
{
    "implements": "part:@sanity/dashboard/config",
    "path": "./myDashboard.js"
}
```


## Example of Dashboard config

```javascript
export default {
  widgets: [
    {
      name: 'google-analytics',
      layout: {
        width: 'large'
      },
      options: {
        title: 'Last 30 days',
        gaConfig: {
          reportType: 'ga',
          query: {
            dimensions: 'ga:date',
            metrics: 'ga:users, ga:sessions, ga:newUsers',
            'start-date': '30daysAgo',
            'end-date': 'yesterday'
          },
          chart: {
            type: 'LINE',
            options: {
              width: '100%',
            }
          }
        }
      }
    },
    {
      name: 'google-analytics',
      layout: {
        width: 'medium'
      },
      options: {
        title: 'World map',
        gaConfig: {
          reportType: 'ga',
          query: {
            dimensions: 'ga:country',
            metrics: 'ga:users',
            'start-date': '30daysAgo',
            'end-date': 'yesterday'
          },
          chart: {
            type: 'GEO',
            width: '100%'
          }
        }
      }
    }
```

### Other widget examples

#### Table of top bouncing pages
```javascript
  {
    name: 'google-analytics',
    layout: {
      width: 'medium'
    },
    options: {
      title: 'Top 10 bouncing blog posts',
      gaConfig: {
        reportType: 'ga',
        query: {
          dimensions: 'ga:pagePath',
          'max-results': 10,
          metrics: 'ga:bounceRate, ga:bounces, ga:pageViews',
          sort: '-ga:bounceRate',
          'start-date': '30daysAgo',
          'end-date': 'yesterday',
          filters: 'ga:pagePath=~^/blog;ga:bounces>50'
        },
        chart: {
          type: 'TABLE',
          options: {
            width: '100%',
          }
        }
      }
    }
  }
```

### Make your own with data from `withAnalyticsData`


Example of an component
```javascript
import withAnalyticsData from "part:@sanity/google-analytics/withAnalyticsData"

class MyComponent extends React.Component {
  render() {
    const {data} = this.props
    return (
      <pre>{JSON.stringify(data)}</pre>
    )
  }
}

export default withAnalyticsData(MyComponent)
```

When you use your component, you can specify what data you want.
```javascript
  <MyComponent config={{
    reportType: 'ga',
    query: {
      dimensions: 'ga:date',
      metrics: 'ga:users, ga:sessions, ga:newUsers',
      'start-date': '365daysAgo',
      'end-date': 'yesterday'
    }
  }} />
```
