import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Account } from '../admin/account/account.model';
import { AccountService } from '../admin/account/account.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { LoginService } from './login.service';
import { AuthService } from '../service/auth.service';
import { TokenService } from '../service/token.service';
import { SessionService } from '../service/session.service';
import { InfoService } from '../service/infoUser.service';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [NgbModal],
})
export class LoginComponent implements OnInit {
  formRegister!: FormGroup;
  formLogin!: FormGroup;
  formForgot!: FormGroup;
  account: Account = {};
  isVisible = false;
  isChangePassWord = false;
  isRegister = false;
  radioValue = 'A';
  isSubmitted = false;
  isLoggedIn = false;
  isforgot = false;
  validateForm!: UntypedFormGroup;
  modalService: any;
  submit = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private accountService: AccountService,
    private authService: AuthService,
    private tokenService: TokenService,
    private sessionService: SessionService,
    private loginService: LoginService,
    private infoUser: InfoService
  ) {}

  ngOnInit(): void {
    if (this.tokenService.getToken()) {
      this.isLoggedIn = true;
    }
    this.initForm();
  }

  initForm() {
    this.formLogin = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
    this.formRegister = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^(?=[^A-Z\\n]*[A-Z])(?=[^a-z\\n]*[a-z])(?=[^0-9\\n]*[0-9])(?=[^#?!@$%^&*\\n-]*[#?!@$%^&*-]).{8,}$'
          ),
        ],
      ],
      repassword: ['', [Validators.required]],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.pattern('(84|0[3|5|7|8|9])+([0-9]{8})'),
        ],
      ],
    });

    this.formForgot! = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', [Validators.required]],
    });
    this.isforgot = true;
  }

  showModal(): void {
    this.submit = false;
    this.initForm();
    this.isVisible = true;
  }

  initRegis() {
    this.formRegister.value.email = '';
    this.formRegister.value.password = '';
    this.formRegister.value.repassword = '';
    this.formRegister.value.phoneNumber = '';
  }

  // handleOk(): void {
  //   this.submit = true;
  //   if (this.formRegister.valid) {
  //     this.registerAccount();
  //   }
  // }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  // registerAccount() {
  //   if (!this.formRegister.valid) {
  //     this.toastr.error('B???n ph???i nh???p ?????y ????? th??ng tin!');
  //     this.isVisible = true;
  //     return;
  //   }
  //   if (
  //     this.formRegister.value.password != this.formRegister.value.repassword
  //   ) {
  //     this.toastr.error('M???t kh???u x??c nh???n ph???i tr??ng kh???p!');
  //     this.isVisible = true;
  //     return;
  //   } else {
  //     this.addValueAccount();
  //     this.accountService.register(this.account).subscribe(
  //       (res) => {
  //         this.toastr.success('????ng k?? t??i kho???n th??nh c??ng!');
  //         this.isVisible = false;
  //       },
  //       (error) => {
  //         this.isVisible = true;
  //         if (error.error.message === 'Email ???? t???n t???i!') {
  //           this.toastr.error(error.error.message);
  //           return;
  //         }
  //         if (error.error.message === 'S??? ??i???n tho???i ???? t???n t???i!') {
  //           this.toastr.error(error.error.message);
  //           return;
  //         }
  //         if (error.error.message === '????ng k?? th???t b???i!') {
  //           this.toastr.error(error.error.message);
  //           return;
  //         }
  //       }
  //     );
  //   }
  // }

  onSubmit() {
    this.isSubmitted = true;
    if (this.formLogin.valid) {
      this.authService.login(this.formLogin.value).subscribe(
        (data) => {
          this.isLoggedIn = true;
          this.tokenService.saveToken(data.token);
          const jwtDecode = this.accountService.getDecodedAccessToken();
          this.tokenService.saveAccount(jwtDecode.sub);
          const role = jwtDecode.auth.split(',');
          this.infoUser.getEmployee();
          if (
            localStorage.getItem('auth-token') != null &&
            role.includes('Admin') || role.includes('Employee')
          ) {
            this.router.navigate(['/admin']);
            this.toastr.success('????ng nh???p th??nh c??ng!');
          }
          if (
            localStorage.getItem('auth-token') != null &&
            role.includes('Customer')
          ) {
            this.router.navigate(['/login']);
            this.toastr.error('B???n kh??ng c?? quy???n ????ng nh???p v??o trang n??y!');
          }
        },
        (error) => {
          this.router.navigate(['/login']);
          this.toastr.error("T??i kho???n ho???c m???t kh???u kh??ng ch??nh x??c!");
        }
      );
      return;
    } else {
      this.toastr.error(
        'B???n ph???i nh???p t??i kho???n v?? m???t kh???u ????? c?? th??? ????ng nh???p!'
      );
      return;
    }
  }

  addValueAccount() {
    this.account.email = this.formRegister.value.email;
    this.account.password = this.formRegister.value.password;
    this.account.phoneNumber = this.formRegister.value.phoneNumber;
  }
}
