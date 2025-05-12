import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminProductsService } from '../adminProducts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-addCategory',
  templateUrl: './addCategory.component.html',
  styleUrls: ['./addCategory.component.css']
})
export class AddCategoryComponent implements OnInit {
  categoryStatusMessage: string | undefined;

  categoryId: any | undefined;
  categoryType: any | undefined;
  categoryValueData: any | undefined;
  categoryClass: any | undefined;
  categoryUniqueId: any | undefined;

  categoryData!: FormGroup;
  existingCategoryData: any | undefined;

  queryParamData: boolean = false;

  constructor(private formBuilder: FormBuilder, private adminService: AdminProductsService, private http: HttpClient, private route: ActivatedRoute, private router: Router, private title: Title) {
    this.categoryData = this.formBuilder.group({
      categoryType: [, Validators.required],
      category: [, Validators.required],
      categoryClass: [, Validators.required],
      categoryUniqueValue: [, Validators.required],
    });

    if (this.route.snapshot.queryParamMap.has('categoryType')) {
      this.queryParamData = true;
      this.route.queryParams.subscribe((params) => {
        this.categoryId = this.route.snapshot.paramMap.get('id');
        this.categoryData.controls['categoryType'].setValue(params['categoryType']),
          this.categoryData.controls['category'].setValue(params['category']),
          this.categoryData.controls['categoryClass'].setValue(params['categoryClass']),
          this.categoryData.controls['categoryUniqueValue'].setValue(params['categoryUnique']),
          this.categoryData.markAsPristine();
      });
      this.categoryType = this.categoryData.controls['categoryType'].value;
      this.categoryValueData = this.categoryData.controls['category'].value;
      this.categoryClass = this.categoryData.controls['categoryClass'].value;
      this.categoryUniqueId = this.categoryData.controls['categoryUniqueValue'].value;

      this.title.setTitle(`${this.categoryValueData} | RK MART`);
    } else {
      this.title.setTitle(`Add Category | RK MART`);
    }
  }

  ngOnInit() {
  }

  addCategory(formData: any) {
    let categoryExist: boolean = false;
    let existingCategoryId: string | number | undefined;

    this.categoryData.invalid ? this.categoryStatusMessage = 'Fill all the fields' : this.categoryStatusMessage = undefined;

    if (this.categoryData.valid) {
      this.adminService.getCategory().subscribe((category: any) => {
        category.forEach((categoryDatas: any) => {
          if (categoryDatas.categoryType == formData.categoryType) {
            categoryExist = true;
            existingCategoryId = categoryDatas.id;
          }
        });
        let categoryValues = {
          categoryType: formData.categoryType,
          category: formData.category.split(','),
          categoryClass: formData.categoryClass.split(','),
          categoryUniqueValue: formData.categoryUniqueValue.split(',')
        }
        categoryExist ? this.dataUpdating(categoryExist, categoryValues, existingCategoryId) : this.dataUpdating(categoryExist, categoryValues, existingCategoryId);
      });
    }
  }

  updateCategory(updatedData: any) {
    if (!this.categoryData.pristine) {
      this.http.get(`http://localhost:3000/category/${this.categoryId}`).subscribe((categoryData: any) => {
        let categoryTypeData = updatedData.categoryType;

        const existingCategory = [...categoryData.category];
        existingCategory[existingCategory.indexOf(this.categoryValueData)] = updatedData.category;

        const existingCategoryClass = [...categoryData.categoryClass];
        existingCategoryClass[existingCategoryClass.indexOf(this.categoryClass)] = updatedData.categoryClass;

        const existingCategoryUniqueValue = [...categoryData.categoryUniqueValue];
        existingCategoryUniqueValue[existingCategoryUniqueValue.indexOf(this.categoryUniqueId)] = updatedData.categoryUniqueValue;

        const updatedDataValue = {
          ...categoryData,
          categoryType: categoryTypeData,
          category: existingCategory,
          categoryClass: existingCategoryClass,
          categoryUniqueValue: existingCategoryUniqueValue
        }

        this.http.get<any>('http://localhost:3000/category').subscribe((data) => {
          let exist: boolean = false;
          let existId: any;
          let dataFound: any = false;
          data.forEach((data: any) => {
            let categoryDataValue = data.category;
            if ((data.categoryType == updatedDataValue.categoryType
              && categoryDataValue.includes(updatedData.category) && dataFound == false)) {
              existId = data.id;
              dataFound = true;
              exist = true;
            } else if ((data.categoryType == updatedDataValue.categoryType) && dataFound == false) {
              existId = data.id;
              dataFound = true;
              exist = true;
            } else if ((data.categoryType != updatedDataValue.categoryType
              && categoryDataValue.includes(updatedData.category)) && dataFound == false) {
              dataFound = true;
              exist = false;
            }
          });
          if (exist == false) {

            this.adminService.updateCategoryData(this.categoryId, updatedDataValue).subscribe((response: any) => {

              this.adminService.getProducts().subscribe((products: any) => {
                products.forEach((product: any) => {
                  if (product.category == categoryData.categoryType) {
                    let category = response.categoryType;
                    this.http.patch(`http://localhost:3000/Productdata/${product.id}`, { category }).subscribe();
                  }
                });
                alert("Updated Successfully");
              });
            });
          } else {

            this.http.get<any>(`http://localhost:3000/category/${existId}`).subscribe((data: any) => {
              let categoryValues = {
                categoryType: updatedData.categoryType,
                category: updatedData.category,
                categoryClass: updatedData.categoryClass,
                categoryUniqueValue: updatedData.categoryUniqueValue
              }
              this.dataUpdating(true, categoryValues, existId);
            });
          }
        })
      })
    } else {
      alert("No Data has been Modified")
    }
  }

  dataUpdating(categoryExist: boolean, categoryData: any, existingCategoryId: number | string | undefined) {

    if (categoryExist == false) {

      var categoryTypeDataValue: any = { categoryTypeData: categoryData.categoryType }

      this.adminService.addCategory(categoryData).subscribe((response) => {
        if (response) {
          this.adminService.addCategoryTypes(categoryTypeDataValue).subscribe();
          this.categoryStatusMessage = "Category Added Successfully";
        }
        setTimeout(() => this.categoryStatusMessage = undefined, 3000);
      });
    }
    if (categoryExist) {

      let categoryDataExist: boolean = false;
      this.http.get(`http://localhost:3000/category/${existingCategoryId}`).subscribe((data: any) => {

        data.category.forEach((datas: any) => {
          if (datas == categoryData.category) {
            categoryDataExist = true;
            this.categoryStatusMessage = "Category Already Exist";
            setTimeout(() => this.categoryStatusMessage = undefined, 3000);
          }
        });

        if (categoryDataExist == false) {
          this.adminService.addCategoryTest(existingCategoryId, "category", "categoryClass", "categoryUniqueValue", categoryData.category, categoryData.categoryClass, categoryData.categoryUniqueValue).subscribe((response) => {
            if (response) {
              if (this.queryParamData) {
                this.adminService.removeCategoryData(this.categoryId, this.categoryValueData, this.categoryClass, this.categoryUniqueId, true, this.categoryType);
              }
              this.categoryStatusMessage = "Category Updated Successfully";
            }
            setTimeout(() => this.categoryStatusMessage = undefined, 3000);
          });
        }
      });
    }
  }
}