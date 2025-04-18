import { User } from '@prisma/client';
import { UserRepository } from '@src/users/user/user.repository';

export const userMock = [
  {
    id: '1',
    name: 'Jonh Doe',
    email: 'jonhdoe@jonhdoe.com',
    password: '12345',
    avatar: null,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Jonh Doe',
    email: 'jonhdoe1@jonhdoe.com',
    password: '12345',
    avatar: null,
    active: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
] as User[];

export const userRepositoryMock = {
  provide: UserRepository,
  useValue: {
    create: jest
      .fn()
      .mockImplementation(({ name, email, password, avatar }) => {
        return Promise.resolve({
          id: 'idNewUser',
          name,
          email,
          password,
          avatar,
          active: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }),
    activateUser: jest.fn().mockImplementation((id) => {
      const userActivate = userMock.filter((user) => {
        if (user.id === id) {
          return user;
        }
      });
      if (userActivate[0]) {
        return Promise.resolve({ ...userActivate[0], active: true });
      } else {
        return Promise.resolve(null);
      }
    }),
    getUniqueById: jest.fn().mockImplementation(({ id }) => {
      const user = userMock.filter((user) => {
        if (user.id === id) {
          return user;
        }
      });
      if (user[0]) {
        return Promise.resolve(user[0]);
      } else {
        return Promise.resolve(null);
      }
    }),
    findByEmail: jest.fn().mockImplementation(({ email }) => {
      const user = userMock.filter((user) => {
        if (user.email === email) {
          return user;
        }
      });
      if (user[0]) {
        return Promise.resolve(user[0]);
      } else {
        return Promise.resolve(null);
      }
    }),
    alterPassword: jest.fn().mockImplementation((id) => {
      const userActivate = userMock.filter((user) => {
        if (user.id === id) {
          return user;
        }
      });
      if (userActivate[0]) {
        return Promise.resolve({ ...userActivate[0], active: true });
      } else {
        return Promise.resolve(null);
      }
    }),
    update: jest.fn().mockImplementation(({ where, data }) => {
      const { id } = where;
      const { name, email, avatar, activeWallet } = data;

      const userActivate = userMock.filter((user) => {
        if (user.id === id) {
          return user;
        }
      });

      let walletID = undefined;
      if (activeWallet) {
        walletID = activeWallet.connect.id;
      }

      if (userActivate[0]) {
        return Promise.resolve({ ...userActivate[0], name, email, avatar, activeWalletId: walletID });
      } else {
        return Promise.resolve(null);
      }
    }),
    delete: jest.fn().mockResolvedValue(true),
  },
};
