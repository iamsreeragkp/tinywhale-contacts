
import {Component, ViewChild, OnInit, ComponentFactoryResolver, ApplicationRef, Injector, OnDestroy, AfterViewInit } from '@angular/core';
import {CdkPortal,DomPortalHost} from '@angular/cdk/portal';

/**
 * This component template wrap the projected content
 * with a 'cdkPortal'.
 */

@Component({
  selector: 'app-window',
  template: `
    <ng-container *cdkPortal>
      <ng-content *ngIf="showBody"></ng-content>
    </ng-container>
  `
})
export class WindowComponent implements OnInit, AfterViewInit, OnDestroy {

  // STEP 1: get a reference to the portal
  @ViewChild(CdkPortal) portal!: CdkPortal;

  // STEP 2: save a reference to the window so we can close it
  private externalWindow!:Window;
  public showBody = false;
  public viewInitialized = false
  height= window.innerHeight-100 ;

  // STEP 3: Inject all the required dependencies for a PortalHost
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private applicationRef: ApplicationRef,
    private injector: Injector){}


  ngOnInit(){

  }

  ngAfterViewInit(): void {
      this.viewInitialized = true;
  }
  openDialog(){
    if(!this.viewInitialized){
      return
    }
      // STEP 4: create an external window
      this.showBody =true;
      this.externalWindow = window.open('', '', 'width=426,height='+this.height+',left=200,top=100')!;
  
      // STEP 5: create a PortalHost with the body of the new window document    
      const host = new DomPortalHost(
        this.externalWindow?.document?.body,
        this.componentFactoryResolver,
        this.applicationRef,
        this.injector
        );
  
      // STEP 6: Attach the portal
      host.attach(this.portal);
  }
  closeDialog(){
    this.externalWindow && this.externalWindow.close()
  
  }

  ngOnDestroy(){
    // STEP 7: close the window when this component destroyed
    this.closeDialog();
  }
}