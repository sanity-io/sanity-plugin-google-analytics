# Sanity Google Analytics Plugin

Analytics widget and components for showing Google Anlytics data in your studio.

```
sanity install google-analytics
```

## How to config

You have to setup a google API, and all your studio users need to have access to the current Google Analytics View

### Setup an API

1. Open the API Library in the Google API Console. If prompted, select a project or create a new one.
2. Find Google Analytics Reporting API and enable it
3. Open the [Credentials page](https://console.developers.google.com/apis/credentials) in the API Console.
4. Click Create credentials > OAuth client ID and select the appropriate Application type.

[Detailed instructions for setup Google Analytics API](https://github.com/google/google-api-javascript-client/blob/master/docs/start.md#setup)

Your `view id` are available inside your [Google Analytics](https://analytics.google.com/).
Go to *admin* → *View settings* to find your `view id`.

### Add config file
Add a `google-analytics-plugin.json` in your `config` folder.

```json
{
  "clientId": "XXXXXXXXXX-xxxxxxxxxxxxxx.apps.googleusercontent.com",
  "views": "ga:xxxxxxxx"
}
```

## Dashboard widgets

If you don't have dashboard, install it with `sanity install @sanity/dashboard`. 
[Dashboard docs](https://www.sanity.io/docs/dashboard)

Make a config file, and add the path yo your `sanity.json`
```json
{
  "implements": "part:@sanity/dashboard/config",
  "path": "./myDashboardConfig.js"
}
```

#### Making queries
To make a query, try the [Query explorer](https://ga-dev-tools.appspot.com/query-explorer/) or find parameters in the [Query reference](https://developers.google.com/analytics/devguides/reporting/core/v3/reference#q_summary)

### Example of Dashboard config

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
        labels: {
          0: 'Page path',
          1: 'Bounce rate',
          2: 'Bounces',
          3: 'Page views'
        },
        options: {
          width: '100%',
        }
      }
    }
  }
}
```

## Make your own component

### `withAnalyticsData`

By wrapping your component in `withAnalyticsData` a `data`-prop will be available in your plugin.

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
    'start-date': '30daysAgo',
    'end-date': 'yesterday'
  }
}} />
```

### Use the analytics widget in your own components
```javascript
import AnalyticsWidget from 'part:@sanity/google-analytics/widget'
import sanityClient from 'part:@sanity/base/client'
<AnalyticsWidget
  config={{
    onSelect: (selectedItem, cell, chart, router) => {
      // Do something with the selected data
      console.log('select', selectedItem, cell, chart, router)
      // Example of finding the id based on slug and navigate to it
      sanityClient.fetch(`*[_type == 'post' && slug.current == $path][0]`, {path}).then(res => {
        router.navigateIntent('edit', {
          type: 'post',
          id: res._id
        })
      })
    },
    reportType: 'ga',
    query: {
      dimensions: 'ga:date',
      metrics: 'ga:users, ga:sessions',
      'start-date': '30daysAgo',
      'end-date': 'yesterday'
    },
    chart: {
      axes: {x: { 0: { label: 'Date' }}},
      type: 'LINE',
      series: {
        0: {title: 'Users', color: '#145eda'},
        1: {title: 'Sessions', color: '#16ae3c'}
      }
    }
}} />
```

### Example of a table with top bouncing blog posts and navigate to them on click
```javascript
{
    name: 'google-analytics',
    layout: {
      width: 'medium'
    },
    options: {
      title: 'Top bouncing posts',
      gaConfig: {
        reportType: 'ga',
        onSelect: (selectedItem, cell, chart, router) => {
          try {
            // Find url
            const path = cell.c[0].v.split('/blog/')[1]
            // Find the ID
            sanityClient.fetch(`*[_type == 'post' && slug.current == $path][0]`, {path}).then(res => {
              // Navigate to post in sanity studio
              router.navigateIntent('edit', {
                type: 'post',
                id: res._id
              })
            })
            
          } catch {
            console.error('Could not find post')
          }
        },
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