# Sanity Google Analytics Plugin

Dashboard widget for showing Anlytics data in your studio

```
sanity install google-analytics
```


## How to config
Add a `google-analytics-plugin.json` in your `config` folder. You need to retrive your `client_id` from your Google API, and your view `id` are available inside your Google Analytics settings.

```json
{
  "clientId": "XXXXXXXXXX-xxxxxxxxxxxxxx.apps.googleusercontent.com",
  "views": "ga:xxxxxxxx"
}
```

You have to setup a google API, and all your studio users need to have access to the current Google Analytics View

[Query reference](https://developers.google.com/analytics/devguides/reporting/core/v3/reference#q_summary)


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

#### Pie

```
  {
    name: 'google-analytics',
    layout: {
      width: 'medium'
    },
    options: {
      title: 'Pageviews by browser',
      gaConfig: {
        reportType: 'ga',
        query: {
          dimensions: 'ga:browser',
          metrics: 'ga:pageViews'
        },
        chart: {
          type: 'PIE',
          width: '100%',
          height: '500px'
        }
      }
    }
  }
```

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