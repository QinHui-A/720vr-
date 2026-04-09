/*
 * @name: Kary
 * @Date: 2025-09-23 16:48:39
 * @Description: 
 */


import { Project } from "./project.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository } from "typeorm";
import { CreateProjectDto } from "./create-project.dto";
import { EditProjectDto } from "./edit-project.dto";
import { UnauthorizedException } from "@nestjs/common";

export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>
  ) { }

  findOne(id: number): Promise<Project | null> {
    return this.projectRepository.findOneBy({ id })
  }

  findAll(): Promise<Project[]> {
    return this.projectRepository.find()
  }

  add(createUserDto: CreateProjectDto): Promise<Project> {
    const project = new Project();
    project.name = createUserDto.name;
    project.description = createUserDto.description || '';
    project.viewerJson = createUserDto.viewerJson || '';
    project.createTime = Date.now();
    project.release = createUserDto.release || 0;
    return this.projectRepository.save(project);
  }

  async edit(editProjectDto: EditProjectDto): Promise<Project> {
    const project = await this.projectRepository.findOneBy({ id: editProjectDto.id });
    if (!project) {
      throw new UnauthorizedException('Project not found');
    }
    project.name = editProjectDto.name || project.name;
    project.description = editProjectDto.description || project.description;
    project.viewerJson = editProjectDto.viewerJson || project.viewerJson;
    project.release = editProjectDto.release || project.release;
    return this.projectRepository.save(project);
  }

  remove(id: number): Promise<DeleteResult> {
    return this.projectRepository.delete(id);
    // return this.projectRepository.delete(id).then(() => null);
  }
}