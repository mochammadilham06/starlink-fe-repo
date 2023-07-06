export interface ArtistRes {
  id: string;
  ArtistName: string;
  PackageName: string;
  ImageURL: string;
  ReleaseDate: string;
  SampleURL: string;
  price: string;
}
export interface ArtistModalProps {
  fetchData: () => void;
  initialData?: ArtistRes;
  mode?: "add" | "update";
}
