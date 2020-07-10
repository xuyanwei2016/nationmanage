import { resolve } from "url";

const pageTemp = {
    state: {
        // 订单管理
        pick_orderSerKeys: {},
        orderSerKeys: {},
        refund_orderSerKeys: {},
        refund_goodsSerKeys: {},
        invoiceSerKeys: {},
        // 商品管理
        goodsInfoSerKeys: {},
        importGoodsSerKeys: {},
        packageManagementSerKeys: {},
        securityCodeSerKeys: {},
        //会员管理
        personMemberSerKeys: {},
        orgCodeSerKeys: {},
        orgMemberSerKeys: {},
        memberCheckinSerKeys: {},
        mailSerKeys: {},
        //营销管理
        prepaidCardSerKeys: {},
        salesGroupSerKeys: {},
        recGroupSerKeys: {},
        //库存管理
        supplierSerKeys: {},
        warehouseSerKeys: {},
        purchaseSerKeys: {},
        storageSerKeys: {},
        deliverySerKeys: {},
        repertorySerKeys: {},
        transferSerKeys: {},
        inventorySerKeys: {},
        returnPurchaseSerKeys: {},
        storageBookSerKeys: {},
        deliveryBookSerKeys: {},
        wdbStorageSerKeys: {},
        //网站管理
        boardContentSerkeys: {},
        ad_posSerKeys: {},
        hot_keywordSerKeys: {},
        msg_managementSerKeys: {},
        error_managementSerKeys: {},
        friendlink_managementSerKeys: {},
        //权限管理
        user_managementSerKeys: {},
        //系统管理
        data_dictionarySerKeys: {},
        systemlogSerKeys: {},
        //统计
        list_detailsSerKeys: {},
        book_detailsSerKeys: {},
        //默认民族
        getNation: 2
    },

    mutations: {
        // 订单管理
        SET_PICK_ORDER_SER_KEY: (state, keys) => {
            state.pick_orderSerKeys = keys
        },
        SET_ORDER_SER_KEY: (state, keys) => {
            state.orderSerKeys = keys
        },
        SET_REFUND_ORDER_SER_KEY: (state, keys) => {
            state.refund_orderSerKeys = keys
        },
        SET_REFUND_GOODS_SER_KEY: (state, keys) => {
            state.refund_goodsSerKeys = keys
        },
        SET_INVOICE_SER_KEYS: (state, keys) => {
            state.invoiceSerKeys = keys
        },
        // 商品管理
        SET_GOODS_INFO_SER_KEY: (state, keys) => {
            state.goodsInfoSerKeys = keys
        },
        SET_IMPORT_GOODS_SER_KEY: (state, keys) => {
            state.importGoodsSerKeys = keys
        },
        SET_PACKAGE_MANAGEMENT_SER_KEY: (state, keys) => {
            state.packageManagementSerKeys = keys
        },
        SET_SECURITY_CODE_SER_KEY: (state, keys) => {
            state.securityCodeSerKeys = keys
        },
        //会员管理
        SET_PERSON_MEMBER_SER_KEY: (state, keys) => {
            state.personMemberSerKeys = keys
        },
        SET_ORG_CODE_SER_KEY: (state, keys) => {
            state.orgCodeSerKeys = keys
        },
        SET_ORG_MEMBER_SER_KEY: (state, keys) => {
            state.orgMemberSerKeys = keys
        },
        SET_MEMBER_CHECKIN_SER_KEY: (state, keys) => {
            state.memberCheckinSerKeys = keys
        },
        SET_MAIL_SER_KEY: (state, keys) => {
            state.mailSerKeys = keys
        },
        //营销管理
        SET_PREPAID_CARD_SER_KEY: (state, keys) => {
            state.prepaidCardSerKeys = keys
        },
        SET_SALES_GROUP_SER_KEY: (state, keys) => {
            state.salesGroupSerKeys = keys
        },
        SET_REC_GROUP_SER_KEY: (state, keys) => {
            state.recGroupSerKeys = keys
        },
        //库存管理
        SET_SUPPLIER_SER_KEY: (state, keys) => {
            state.supplierSerKeys = keys
        },
        SET_WAREHOUSE_SER_KEY: (state, keys) => {
            state.warehouseSerKeys = keys
        },
        SET_PURCHASE_SER_KEY: (state, keys) => {
            state.purchaseSerKeys = keys
        },
        SET_STORAGE_SER_KEY: (state, keys) => {
            state.storageSerKeys = keys
        },
        SET_DELIVERY_SER_KEY: (state, keys) => {
            state.deliverySerKeys = keys
        },
        SET_REPERTORY_SER_KEY: (state, keys) => {
            state.repertorySerKeys = keys
        },
        SET_TRANSFER_SER_KEY: (state, keys) => {
            state.transferSerKeys = keys
        },
        SET_INVENTORY_SER_KEY: (state, keys) => {
            state.inventorySerKeys = keys
        },
        SET_RETURN_PRUCHASE_SER_KEY: (state, keys) => {
            state.returnPurchaseSerKeys = keys
        },
        SET_STORAGE_BOOK_SER_KEY: (state, keys) => {
            state.storageBookSerKeys = keys
        },
        SET_DELIVERY_BOOK_SER_KEY: (state, keys) => {
            state.deliveryBookSerKeys = keys
        },
        SET_WDB_STORAGE_SER_KEY: (state, keys) => {
            state.wdbStorageSerKeys = keys
        },
        //网站管理
        SET_BOARD_CONTENT_SER_KEY: (state, keys) => {
            state.boardContentSerkeys = keys
        },
        SET_AD_POS_SER_KEY: (state, keys) => {
            state.ad_posSerKeys = keys
        },
        SET_HOT_KEYWORD_SER_KEY: (state, keys) => {
            state.hot_keywordSerKeys = keys
        },
        SET_MSG_MANAGEMENT_SER_KEY: (state, keys) => {
            state.msg_managementSerKeys = keys
        },
        SET_ERROR_MANAGEMENT_SER_KEY: (state, keys) => {
            state.error_managementSerKeys = keys
        },
        SET_FRINENDLINK_MANAGEMENT_SER_KEY: (state, keys) => {
            state.friendlink_managementSerKeys = keys
        },
        SET_USER_MANAGEMENT_SER_KEY: (state, keys) => {
            state.user_managementSerKeys = keys
        },
        SET_DATA_DICTIONARY_SER_KEY: (state, keys) => {
            state.data_dictionarySerKeys = keys
        },
        SET_SYSTEMLOG_SER_KEY: (state, keys) => {
            state.systemlogSerKeys = keys
        },
        SET_LIST_DETAILS_SER_KEY: (state, keys) => {
            state.list_detailsSerKeys = keys
        },
        SET_BOOK_DETAILS_SER_KEY: (state, keys) => {
            state.book_detailsSerKeys = keys
        },
        SET_NATION: (state, nation) => {
            state.getNation = nation
        }

    },

    actions: {
        // 订单管理
        SetPickOrderSerKey({ commit }, keys) {
            return new Promise(resolve => {
                commit('SET_PICK_ORDER_SER_KEY', keys)
                resolve(keys)
            })
        },
        SetOrderSerKey({ commit }, keys) {
            return new Promise(resolve => {
                commit('SET_ORDER_SER_KEY', keys)
                resolve(keys)
            })
        },
        SetRefundOrderSerKey({ commit }, keys) {
            return new Promise(resolve => {
                commit('SET_REFUND_ORDER_SER_KEY', keys)
                resolve(keys)
            })
        },
        SetRefundGoodsSerKeys({ commit }, keys) {
            return new Promise(resolve => {
                commit('SET_REFUND_GOODS_SER_KEY', keys)
                resolve(keys)
            })
        },
        SetInvoiceSerKeys({ commit }, keys) {
            return new Promise(resolve => {
                commit('SET_INVOICE_SER_KEYS', keys)
                resolve(keys)
            })
        },
        // 商品管理
        SetGoodsInfoSerKeys({ commit }, keys) {
            return new Promise(resolve => {
                commit('SET_GOODS_INFO_SER_KEY', keys)
                resolve(keys)
            })
        },
        SetImportGoodsSerKeys({ commit }, keys) {
            return new Promise(resolve => {
                commit('SET_IMPORT_GOODS_SER_KEY', keys)
                resolve(keys)
            })
        },
        SetPackageManagementSerKeys({ commit }, keys) {
            return new Promise(resolve => {
                commit('SET_PACKAGE_MANAGEMENT_SER_KEY', keys)
                resolve(keys)
            })
        },
        SetSecurityCodeSerKeys({ commit }, keys) {
            return new Promise(resolve => {
                commit('SET_SECURITY_CODE_SER_KEY', keys)
                resolve(keys)
            })
        },
        //会员管理
        SetPersonMemberSerKeys({ commit }, keys) {
            return new Promise(resolve => {
                commit('SET_PERSON_MEMBER_SER_KEY', keys)
                resolve(keys)
            })
        },
        SetOrgCodeSerKeys({ commit }, keys) {
            return new Promise(resolve => {
                commit('SET_ORG_CODE_SER_KEY', keys)
                resolve(keys)
            })
        },
        SetOrgMemberSerKeys({ commit }, keys) {
            return new Promise(resolve => {
                commit('SET_ORG_MEMBER_SER_KEY', keys)
                resolve(keys)
            })
        },
        SetMemberCheckinSerKeys({ commit }, keys) {
            return new Promise(resolve => {
                commit('SET_MEMBER_CHECKIN_SER_KEY', keys)
                resolve(keys)
            })
        },
        SetMailSerKeys({ commit }, keys) {
            return new Promise(resolve => {
                commit('SET_MAIL_SER_KEY', keys)
                resolve(keys)
            })
        },
        //营销管理
        SetPrepaidCardSerKeys({ commit }, keys) {
            return new Promise(resolve => {
                commit('SET_PREPAID_CARD_SER_KEY', keys)
                resolve(keys)
            })
        },
        SetSalesGroupSerKeys({ commit }, keys) {
            return new Promise(resolve => {
                commit('SET_SALES_GROUP_SER_KEY', keys)
                resolve(keys)
            })
        },
        SetRecGroupSerKeys({ commit }, keys) {
            return new Promise(resolve => {
                commit('SET_REC_GROUP_SER_KEY', keys)
                resolve(keys)
            })
        },
        //库存管理
        SetSupplierSerKeys({ commit }, keys) {
            return new Promise(resolve => {
                commit('SET_SUPPLIER_SER_KEY', keys)
                resolve(keys)
            })
        },
        SetWarehouseSerKeys({ commit }, keys) {
            return new Promise(resolve => {
                commit('SET_WAREHOUSE_SER_KEY', keys)
                resolve(keys)
            })
        },
        SetPurchaseSerKeys({ commit }, keys) {
            return new Promise(resolve => {
                commit('SET_PURCHASE_SER_KEY', keys)
                resolve(keys)
            })
        },
        SetStorageSerKeys({ commit }, keys) {
            return new Promise(resolve => {
                commit('SET_STORAGE_SER_KEY', keys)
                resolve(keys)
            })
        },
        SetDeliverySerKeys({ commit }, keys) {
            return new Promise(resolve => {
                commit('SET_DELIVERY_SER_KEY', keys)
                resolve(keys)
            })
        },
        SetRepertorySerKeys({ commit }, keys) {
            return new Promise(resolve => {
                commit('SET_REPERTORY_SER_KEY', keys)
                resolve(keys)
            })
        },
        SetTransferSerKeys({ commit }, keys) {
            return new Promise(resolve => {
                commit('SET_TRANSFER_SER_KEY', keys)
                resolve(keys)
            })
        },
        SetInventorySerKeys({ commit }, keys) {
            return new Promise(resolve => {
                commit('SET_INVENTORY_SER_KEY', keys)
                resolve(keys)
            })
        },
        SetReturnPurchaseSerKeys({ commit }, keys) {
            return new Promise(resolve => {
                commit('SET_RETURN_PRUCHASE_SER_KEY', keys)
                resolve(keys)
            })
        },
        SetStorageBookSerKeys({ commit }, keys) {
            return new Promise(resolve => {
                commit('SET_STORAGE_BOOK_SER_KEY', keys)
                resolve(keys)
            })
        },
        SetDeliveryBookSerKeys({ commit }, keys) {
            return new Promise(resolve => {
                commit('SET_DELIVERY_BOOK_SER_KEY', keys)
                resolve(keys)
            })
        },
        SetWdbStorageSerKeys({ commit }, keys) {
            return new Promise(resolve => {
                commit('SET_WDB_STORAGE_SER_KEY', keys)
                resolve(keys)
            })
        },
        //网站管理
        SetBoardContentSerKeys({ commit }, keys) {
            return new Promise(resolve => {
                commit('SET_BOARD_CONTENT_SER_KEY', keys)
                resolve(keys)
            })
        },
        SetAdPosSerKeys({ commit }, keys) {
            return new Promise(resolve => {
                commit('SET_AD_POS_SER_KEY', keys)
                resolve(keys)
            })
        },
        SetHotKeywordSerKeys({ commit }, keys) {
            return new Promise(resolve => {
                commit('SET_HOT_KEYWORD_SER_KEY', keys)
                resolve(keys)
            })
        },
        SetMsgManagementSerKeys({ commit }, keys) {
            return new Promise(resolve => {
                commit('SET_MSG_MANAGEMENT_SER_KEY', keys)
                resolve(keys)
            })
        },
        SetErrorManagementSerKeys({ commit }, keys) {
            return new Promise(resolve => {
                commit('SET_ERROR_MANAGEMENT_SER_KEY', keys)
                resolve(keys)
            })
        },
        SetFriendlinkManagementSerKeys({ commit }, keys) {
            return new Promise(resolve => {
                commit('SET_FRINENDLINK_MANAGEMENT_SER_KEY', keys)
                resolve(keys)
            })
        },
        SetUserManagementSerKeys({ commit }, keys) {
            return new Promise(resolve => {
                commit('SET_USER_MANAGEMENT_SER_KEY', keys)
                resolve(keys)
            })
        },
        SetDataDictionarySerKeys({ commit }, keys) {
            return new Promise(resolve => {
                commit('SET_DATA_DICTIONARY_SER_KEY', keys)
                resolve(keys)
            })
        },
        SetSystemlogSerKeys({ commit }, keys) {
            return new Promise(resolve => {
                commit('SET_SYSTEMLOG_SER_KEY', keys)
                resolve(keys)
            })
        },
        //统计
        SetListDetailsSerKeys({ commit }, keys) {
            return new Promise(resolve => {
                commit('SET_LIST_DETAILS_SER_KEY', keys)
                resolve(keys)
            })
        },
        SetBookDetailsSerKeys({ commit }, keys) {
            return new Promise(resolve => {
                commit('SET_BOOK_DETAILS_SER_KEY', keys)
                resolve(keys)
            })
        },
        //民族
        setNation({ commit }, nation) {
            commit('SET_NATION', nation)
        }

    }
}

export default pageTemp