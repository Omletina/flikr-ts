
type photoItem = {
  owner: string,
  title: string,
  farm: number,
  server: string,
  id: string,
  secret: string
};

type photoData = photoItem[];

class Flikr {

  protected _passedOpts: any;
  protected _searchHandler: (e: Event) => void;
  protected _getOwnerHandler: (e: MouseEvent) => void;

  constructor(opts: any) {
    this._passedOpts = opts;

    this._searchHandler = (e: Event): void => {
      e.preventDefault();

      let inputElem: HTMLInputElement = <HTMLInputElement>this._passedOpts.elems.inputElem;
      let imagesArea: HTMLElement = <HTMLElement>this._passedOpts.elems.imagesArea;
      let searchQuery: string = inputElem.value;

      this._setLoadingState();
      this._getPhotos(searchQuery).then((photos: photoData) => {
        imagesArea.innerHTML = this._render(photos);
        this._setWaitingState();
      });

    };

    this._getOwnerHandler = (e: MouseEvent): void => {
      e.preventDefault();

      let target: HTMLElement = <HTMLElement>e.target;
      let ownerId: string = target.dataset['owner'];
      if (!ownerId) {
        return;
      }

      let parentElem: HTMLElement = <HTMLElement>target.parentNode;

      parentElem.innerHTML = "<p>Loading...</p>";

      this._getOwner(ownerId).then(username => {
        parentElem.innerHTML = `<p><strong>Owner</strong>: ${username}</p>`;
      });
    };

  }

  init(): void {
    let formElem: HTMLFormElement = <HTMLFormElement>this._passedOpts.elems.formElem;
    let imagesArea: HTMLElement = <HTMLElement>this._passedOpts.elems.imagesArea;

    formElem.addEventListener("submit", this._searchHandler);
    imagesArea.addEventListener("click", this._getOwnerHandler);
  }

  protected _getOwner(ownerId: string): PromiseLike<any> {
    let { uri, infoMethod, key } = this._passedOpts.api;
    let queryAddress: string = `${uri}method=${infoMethod}&api_key=${key}&user_id=${ownerId}&format=json&nojsoncallback=1`;

    return fetch(queryAddress)
      .then(res => res.json())
      .then(data => data.person.username._content);
  }

  protected _setLoadingState(): void {
    let buttonElem: HTMLButtonElement = <HTMLButtonElement>this._passedOpts.elems.buttonElem;

    buttonElem.disabled = true;
    buttonElem.value = "Loading...";
  }

  protected _setDefaultState(): void {
    let buttonElem: HTMLButtonElement = <HTMLButtonElement>this._passedOpts.elems.buttonElem;

    buttonElem.disabled = false;
    buttonElem.value = "Search";
  }

  protected _setWaitingState(): void {
    let buttonElem: HTMLButtonElement = <HTMLButtonElement>this._passedOpts.elems.buttonElem;
    let searchTimeout: number = this._passedOpts.searchTimeout;

    buttonElem.disabled = true;

    let timeLeft: number = searchTimeout - 1000;
    let timer: any = setInterval(() => {
      if (timeLeft > 0) {
        buttonElem.value = `Wait ${timeLeft / 1000}s`;
        timeLeft -= 1000;
        return;
      };

      clearInterval(timer);
      this._setDefaultState();
    }, 1000);
  }

  protected _getPhotos(searchQuery: string): PromiseLike<any> {
    let { uri, searchMethod, key } = this._passedOpts.api;
    let queryAddress: string = `${uri}method=${searchMethod}&api_key=${key}&text=${searchQuery}&page=1&format=json&nojsoncallback=1`;

    return fetch(queryAddress)
      .then(res => res.json())
      .then(data => this._parseFetchedPhotos(data.photos.photo));
  }

  protected _parseFetchedPhotos(photos: any[]): photoData {
    return photos.map(photo => {
      let filtered: photoItem = {
        owner: photo.owner,
        title: photo.title,
        farm: photo.farm,
        server: photo.server,
        id: photo.id,
        secret: photo.secret
      };

      return filtered;
    });
  }

  protected _render(photos: photoData): string {
    let content: string = ``;

    for (let photo of photos) {
      content += `
        <div class="image-box">
          <img src="https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg" />
          <p>${photo.title}</p>
          <p>
            <a href="#" data-owner="${photo.owner}">About owner</a>
          </p>
        </div>`;
    }

    return content;
  }
}


let app: Flikr = new Flikr({
  elems: {
    formElem: document.querySelector(".search-panel"),
    inputElem: document.querySelector(".flickr-search-input"),
    buttonElem: document.querySelector(".flickr-search-button"),
    imagesArea: document.querySelector(".image-area")
  },
  api: {
    uri: "https://api.flickr.com/services/rest/?",
    searchMethod: "flickr.photos.search",
    key: "7fbc4d0fd04492d32fa9a2f718c6293e",
    infoMethod: "flickr.people.getInfo"
  },
  searchTimeout: 5000
});

app.init();


