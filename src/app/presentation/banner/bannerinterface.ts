type TableHeader = {
  field : string,
  header : string
}
type Length = number;
type LoadingIndicator = boolean;
interface DATAOFTABLE {
  Title : string;
  Target : string;
  Platform : string;
  // "Location in the page" : string;
  // "Page URL" : string;
}


export {
  TableHeader,
  Length,
  LoadingIndicator,
  DATAOFTABLE
}
