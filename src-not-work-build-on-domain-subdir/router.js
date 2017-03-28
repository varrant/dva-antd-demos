import React, { PropTypes } from 'react'
import { Router } from 'dva/router'
import App from './routes/app'
import { ADMIN_PREFIX } from './constants'

// 注册model
const cached = {}
const registerModel = (app, model) => {
  if (!cached[model.namespace]) {
    app.model(model)
    cached[model.namespace] = 1
  }
}


const Routers = function({ history, app }) {
  const routes = [
    {
      path: '/',
      component: App,
      getIndexRoute (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/dashboard'))
          cb(null, { component: require('./routes/dashboard/') })
        }, 'dashboard')
      },
      childRoutes: [
        {
          path: 'dashboard',
          name: 'dashboard',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/dashboard'))
              cb(null, require('./routes/dashboard/'))
            }, 'menus')
          }
        }
      ]
    },
    {
      path: '/' + ADMIN_PREFIX,
      component: App,
      childRoutes: [
        {
          path: 'menus',
          name: 'menus',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/menus'))
              cb(null, require('./routes/menus/'))
            }, 'menus')
          }
        }, {
          path: 'categories',
          name: 'categories',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/categories'))
              cb(null, require('./routes/categories/'))
            }, 'categories')
          }
        }, {
          path: 'users',
          name: 'users',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/users'))
              cb(null, require('./routes/users/'))
            }, 'categories')
          }
        }, {
          path: '*',
          name: 'error',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/error/'))
            }, 'error')
          },
        },
      ]
    }
  ];

  return <Router history={history} routes={routes} />
}

export default Routers
