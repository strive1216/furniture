'use strict'
/*
 * @Author: ZhaoLei 
 * @Date: 2017-08-23 10:58:12 
 * @Last Modified by: ZhaoLei
 * @Last Modified time: 2017-09-11 09:49:16
 */
const logUtil = require('../models/log4js/log_utils')
const Promise = require('bluebird')
const _ = require('lodash')
var userutil = require('./user')
const sqlutil = require('../models/mysql/util')

var moment = require('moment-timezone')
moment.tz.setDefault('Asia/Shanghai')


var fun = {
    /**
     * 编号最近一次的工序信息
     */
    fetchprostatus: async function(proid) {
        var res = {
            code: 'ok'
        }
        if (!proid) {
            return {
                code: 'error',
                message: '编号为空'
            }
        }
        try {
            var sql1 = `SELECT COUNT(*)as num FROM workrecord AS wrd INNER JOIN workstageinfo AS wsi ON wrd.workstageid = wsi.id WHERE wsi.orderinfo='${proid}'`
            var res1 = await sqlutil.query(sql1)
            if (res1[0].num > 0) {
                var sql2 = `SELECT
                    oif.pid,
                    oif.status,
                    wsi.orderinfo,
                    wrd.userid,
                    wsi.workstage,
                    wsi.id,
                    DATE_FORMAT( wrd.recordtime, '%Y-%m-%d %H:%i:%s') as recordtime,
                    wrd.kind,
                    wsi.index,
                CASE
                    WHEN wsi.index + 1 > ( SELECT MAX( wsi.index ) FROM workstageinfo AS wsi WHERE wsi.orderinfo = '${proid}' ) THEN
                    'ok' ELSE ( SELECT s.workstage FROM workstageinfo AS s WHERE s.index = wsi.index + 1 AND s.orderinfo = '${proid}' ) 
                    END AS next,
                    ( SELECT id FROM workstageinfo AS s WHERE s.orderinfo = '${proid}' AND s.INDEX = wsi.INDEX+1) as nextindex
                FROM
                    orderinfo AS oif
                    LEFT JOIN workstageinfo AS wsi ON wsi.orderinfo = oif.pid
                    LEFT JOIN workrecord AS wrd ON wrd.workstageid = wsi.id 
                WHERE
                    wsi.orderinfo = '${proid}' 
                    AND (
                    SELECT
                        max( wsi.index ) AS m 
                    FROM
                        workrecord AS wrd
                        LEFT JOIN workstageinfo AS wsi ON wrd.workstageid = wsi.id 
                    WHERE
                    wsi.orderinfo = '${proid}' 
                ) = wsi.index`
                res.data = await sqlutil.query(sql2)
            } else {
                let sql3 = `SELECT
                    0 'index' ,
                    null workstage,
                    wsi.workstage as next,
                    odif.pid,
                    wsi.orderinfo,
                    wrd.userid,
                    DATE_FORMAT( wrd.recordtime, '%Y-%m-%d %H:%i:%s') as recordtime,
                    wrd.kind,
                    odif.status,
                    (SELECT id FROM workstageinfo AS s WHERE s.orderinfo = '${proid}' AND s.INDEX =0)as nextindex
                    FROM
                    workstageinfo AS wsi
                    left JOIN workrecord AS wrd ON wrd.workstageid = wsi.id
                    LEFT JOIN orderinfo as odif on  wsi.orderinfo=odif.pid
                    WHERE wsi.orderinfo='${proid}' AND  wsi.index=0`
                res.data = await sqlutil.query(sql3)
            }
        } catch (error) {
            res = {
                code: 'error',
                message: error.message
            }
        }
        return res

    },

    /**
     * 产品记录查询
     */
    fetchprolog: async function(params) {
        var res = {
            code: 'ok'
        }
        if (!params) {
            res = {
                code: 'error',
                message: '参数错误'
            }
        } else {
            try {
                var valsql = 'WHERE 1=1'
                if (params.pid) {
                    valsql += ` and odi.pid ='${params.pid}' `
                }
                if (params.search) {
                    valsql += ` and concat(odi.pid,odi.regtime,odi.status,	odi.category,wsi.index,	wsi.workstage,IFNULL( wcd.userid, '' ),IFNULL( wcd.recordtime, '' ),IFNULL( wcd.kind, '' ) ) like '%${params.search}%'`
                }
                let sql1 = `SELECT 	odi.pid,DATE_FORMAT( odi.regtime, '%Y-%m-%d %H:%i:%s') as regtime,odi.status,	odi.category,wsi.index,	wsi.workstage,wcd.userid,DATE_FORMAT(wcd.recordtime, '%Y-%m-%d %H:%i:%s') as recordtime,wcd.kind FROM orderinfo AS odi	LEFT JOIN workstageinfo AS wsi ON wsi.orderinfo = odi.pid	LEFT JOIN workrecord AS wcd ON wcd.workstageid = wsi.id ${valsql} ORDER BY odi.pid,wsi.index,wcd.recordtime  LIMIT ?,?`
                let val = await sqlutil.query(sql1, [params.offset, params.limit])
                res.data = val
            } catch (error) {
                res = {
                    code: 'error',
                    message: error.message
                }
            }
        }
        return res
    }

}

exports = module.exports = fun