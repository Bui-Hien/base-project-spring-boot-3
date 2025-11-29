package com.buihien.core.dto.excel;

import com.buihien.core.dto.AuditableDto;
import com.buihien.core.util.anotation.Excel;
import com.buihien.core.util.anotation.ExcelColumnGetter;

@Excel(name = "DanhSachTaiKhoanDaBan")
public class OrderExcelDto extends AuditableDto {
    private String orderCode;
    private String accountCategoryName;//Loại tài khoản
    private String createAt;//thời gian giao dịch
    private String accountName; //Tên tài khoản
    private String accountUnitPrice;  // đơn giá
    private String accountPrice;  // giá tiền
    private String accountTotalAmount;// thành tiền
    private String accountWarrantyPeriod;// thời gian bảo hành (phút)
    private String twoFactor;             // thông tin 2FA
    private String accountPremium;  // tài khoản premium hay không
    private String accountWarrantyIssued; // bảo hành đã phát hành
    private String sellerName;// người mua
    private String buyerName;   // người bán
    private String status;//trạng thái

    public OrderExcelDto() {
        super();
    }

    @ExcelColumnGetter(index = 0, title = "Mã đơn hàng")
    public String getOrderCode() {
        return orderCode;
    }

    @ExcelColumnGetter(index = 1, title = "Loại tài khoản")
    public String getAccountCategoryName() {
        return accountCategoryName;
    }

    @ExcelColumnGetter(index = 2, title = "Thời gian giao dịch")
    public String getCreateAt() {
        return createAt;
    }

    @ExcelColumnGetter(index = 3, title = "Trạng thái đơn hàng")
    public String getStatus() {
        return status;
    }

    @ExcelColumnGetter(index = 4, title = "Tên tài khoản")
    public String getAccountName() {
        return accountName;
    }

    @ExcelColumnGetter(index = 5, title = "Đơn giá")
    public String getAccountUnitPrice() {
        return accountUnitPrice;
    }

    @ExcelColumnGetter(index = 6, title = "Giá tiền")
    public String getAccountPrice() {
        return accountPrice;
    }

    @ExcelColumnGetter(index = 7, title = "Thành tiền")
    public String getAccountTotalAmount() {
        return accountTotalAmount;
    }

    @ExcelColumnGetter(index = 8, title = "Thời gian bảo hành")
    public String getAccountWarrantyPeriod() {
        return accountWarrantyPeriod;
    }

    @ExcelColumnGetter(index = 9, title = "Tài khoản premium hay không")
    public String getAccountPremium() {
        return accountPremium;
    }

    @ExcelColumnGetter(index = 10, title = "Thông tin 2FA")
    public String getTwoFactor() {
        return twoFactor;
    }


    @ExcelColumnGetter(index = 11, title = "Bảo hành đã phát hành")
    public String getAccountWarrantyIssued() {
        return accountWarrantyIssued;
    }


    @ExcelColumnGetter(index = 12, title = "Tên người bán")
    public String getSellerName() {
        return sellerName;
    }

    @ExcelColumnGetter(index = 13, title = "Tên người mua")
    public String getBuyerName() {
        return buyerName;
    }
}
