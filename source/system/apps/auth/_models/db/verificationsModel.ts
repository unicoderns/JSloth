////////////////////////////////////////////////////////////////////////////////////////////
// The MIT License (MIT)                                                                  //
//                                                                                        //
// Copyright (C) 2016  Unicoderns SA - info@unicoderns.com - unicoderns.com               //
//                                                                                        //
// Permission is hereby granted, free of charge, to any person obtaining a copy           //
// of this software and associated documentation files (the "Software"), to deal          //
// in the Software without restriction, including without limitation the rights           //
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell              //
// copies of the Software, and to permit persons to whom the Software is                  //
// furnished to do so, subject to the following conditions:                               //
//                                                                                        //
// The above copyright notice and this permission notice shall be included in all         //
// copies or substantial portions of the Software.                                        //
//                                                                                        //
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR             //
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,               //
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE            //
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER                 //
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,          //
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE          //
// SOFTWARE.                                                                              //
////////////////////////////////////////////////////////////////////////////////////////////

import * as usersModel from "./usersModel";
import { field, secret, Fields, Defaults, Datatypes, Models, Model } from "@unicoderns/orm"

export interface Row extends Models.Row {
    id?: number;
    created?: number;
    token: string;
    user: number;
}

/**
 * User Model
 */
export class Verifications extends Model {

    @field()
    public id: Fields.DataType = new Datatypes().ID();

    @field()
    public created: Fields.DataTimestampType = new Datatypes().TIMESTAMP({
        notNull: true,
        default: Defaults.Timestamp.CURRENT_TIMESTAMP
    });

    @field()
    public token: Fields.DataType = new Datatypes().VARCHAR({
        size: 6,
        notNull: true
    });

    // ToDo: Specify the localField looks redundant
    @field()
    public user: Fields.ForeignKey = new Datatypes().FOREIGNKEY("user", "id", new usersModel.Users(this.DB), {
        notNull: true,
        unique: true
    });

    // Generate and save an unique token
    public getToken(id: number): Promise<string> {
        let generateToken = (): string => {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < 6; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }

            return text;
        };

        let saveToken = (): Promise<string> => {
            const p: Promise<string> = new Promise(
                (resolve: (data: string) => void, reject: (err: NodeJS.ErrnoException) => void) => {
                    let token = generateToken();
                    this.get({
                        where: { token: token }
                    }).then((data) => {
                        if (typeof data === "undefined") {
                            let temp: Row = {
                                token: token,
                                user: id
                            };
                            this.insert(temp).then((data: any) => {
                                return resolve(token);
                            }).catch(err => {
                                console.error(err);
                                return saveToken();
                            });
                        } else {
                            return saveToken();
                        }
                    }).catch(err => {
                        console.error(err);
                        return saveToken();
                    });
                });
            return p;
        }
        
        return saveToken();
    }

}