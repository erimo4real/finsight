import { IUserDTO } from "../dtos/user.dto";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: IUserDTO & JwtPayload;
      file?: Express.Multer.File; // ✅ allow multer file access
    }
  }
}

export {};







// import { IUserDTO } from "../dtos/user.dto";
// import { JwtPayload } from "jsonwebtoken";

// declare global {
//   namespace Express {
//     interface Request {
//       user?: IUserDTO & JwtPayload;
//     }
//   }
// }

// export {};
