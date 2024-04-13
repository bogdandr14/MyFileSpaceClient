export class AppError {
  public message: string;
  public status: number;
  constructor(public originalErr?: any) {
    if (originalErr?.message) {
      this.message = originalErr?.message;
    } else if (originalErr?.errors) {
      let text = '';

      Object.keys(originalErr?.errors).forEach((key) => {
        originalErr.errors[key].forEach((err: any) => {
          return (text += `${err}${'\n'}`);
        });
      });

      this.message = text;
    } else {
      this.message = originalErr ?? '';
    }
    if(originalErr?.status){
      this.status  = originalErr.status;
    }
  }
}
