import { HttpHeaders } from "@angular/common/http";

export interface HttpInterceptorConfig {
  /**
   * Hide loading until HTTP response is received
   */
   hideLoading?: boolean;

   /**
    * Success message to be displayed
    */
   successMessage?: string;

   /**
    * Show success message indicator
    */
   showSuccessMessage?: boolean;

   /**
    * Http headers for request
    */
   httpHeaders?: HttpHeaders;
}
