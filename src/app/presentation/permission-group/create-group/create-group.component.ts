import { RoleService } from './../../../Services/permissionRole/role.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss'],
})
export class CreateGroupComponent implements OnInit {
  roleForm: any;
  idRole: number = 0;
  submitted: boolean = false;
  allRole: any[] = [];

  roleName: string = '';
  permissionRole: any[] = [];
  showPermissionRole: any[] = [];
  constructor(
    private _Router: Router,
    private fb: FormBuilder,
    private rolePer: RoleService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {
    this.roleForm = this.fb.group({
      Group_name: ['', [Validators.required]],
      Role_name: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.rolePer.getPeermissionRole().subscribe((data: any) => {
      this.allRole = data.data;
    });

    this.route.params.subscribe((data: any) => {
      if (data.id) {
        this.idRole = data.id;
        this.roleForm.controls['Role_name'].clearValidators();
        this.roleForm.controls['Role_name'].updateValueAndValidity();
        this.rolePer.showOneRole(data.id).subscribe((res: any) => {
          this.roleForm.patchValue({
            Group_name: res.data.name,
          });
          this.showPermissionRole = res.data.permissions;
        });
      }
    });
  }

  lengthOfchecked: number = 0;
  chaning(e: any) {
    this.roleName = e.value.name;
    this.permissionRole = e.value.permissions;
    this.permissionRole.forEach((ele: any) => {
      if (this.showPermissionRole.includes(ele)) ++this.lengthOfchecked;
    });
    if (this.lengthOfchecked == this.permissionRole.length)
      this.isChecked = true;
    else this.isChecked = false;

    this.lengthOfchecked = 0;
  }

  createPermission(permis: any) {
    if (!this.showPermissionRole.includes(permis)) {
      this.showPermissionRole.push(permis);
    }
  }

  isChecked: boolean = false;
  addAll(permis: any) {
    if (this.isChecked) {
      permis.forEach((ele: any) => {
        if (this.showPermissionRole.includes(ele)) {
          this.showPermissionRole.splice(
            this.showPermissionRole.indexOf(ele),
            1
          );
        }
      });
    } else {
      permis.forEach((ele: any) => {
        if (!this.showPermissionRole.includes(ele)) {
          this.showPermissionRole.push(ele);
        }
      });
    }
    this.isChecked = !this.isChecked;
  }

  deletePermission(permissionId: number) {
    this.showPermissionRole.forEach((data: any, i: number) => {
      if (permissionId == data.id) {
        this.showPermissionRole.splice(i, 1);
      }
    });
  }

  createRole() {
    this.submitted = true;
    let arrOfPermis = this.showPermissionRole.map((ele) => {
      return ele.id;
    });
    let role: any = {
      name: this.roleForm.get('Group_name').value,
      permissions: arrOfPermis,
    };
    if (this.roleForm.valid) {
      this.rolePer
        .createRole(role)
        .pipe(
          finalize(() => {
            this.submitted = false;
          })
        )
        .subscribe((data) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'this Role is created successfully',
          });
          this.showPermissionRole = [];
          this.roleForm.patchValue({
            Group_name: '',
            Role_name: '',
          });
        });
    }
  }

  editRole() {
    this.submitted = true;
    let arrOfPermis = this.showPermissionRole.map((ele) => {
      return ele.id;
    });
    let role: any = {
      name: this.roleForm.get('Group_name').value,
      permissions: arrOfPermis,
    };
    if (this.roleForm.valid) {
      this.rolePer
        .updateRole(role, this.idRole)
        .pipe(
          finalize(() => {
            this.submitted = false;
          })
        )
        .subscribe((data) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'this Role is Update successfully',
          });
          this.showPermissionRole = [];
          this.roleForm.patchValue({
            Group_name: '',
            Role_name: '',
          });
        });
    }
  }

  reset() {
    this.showPermissionRole = [];
    this.roleForm.patchValue({
      Group_name: '',
      Role_name: '',
    });
  }

  backToRole() {
    this._Router.navigate(['Dashboard/permissionGroup']);
  }
}
